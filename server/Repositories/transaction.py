from sqlalchemy.orm import Session, joinedload
from Schemas.transaction import Transaction
from sqlalchemy import case, func
from typing import Optional

from DTOs.transaction import Transaction_Dto

class Transaction_Repository:
    def create_transaction(self, db:Session, transaction_dto: Transaction_Dto):
        transaction = Transaction(**transaction_dto.model_dump())
    
        db.add(transaction)
        db.commit()
        db.refresh(transaction)
        return transaction
    
    def get_transactions(
    self,
    db: Session,
    user_id: str,
    account_type: str,
    transaction_type: Optional[str] = None,
    page_num: int = 1,
    page_size: int = 7
    ):
        offset = (page_num - 1) * page_size

        query = (
            db.query(Transaction)
            .join(Transaction.acc_1_r)
            .filter(Transaction.user_id == user_id)
            .filter(Transaction.acc_1_r.has(type=account_type))
        )

        if transaction_type:
            query = query.filter(Transaction.type == transaction_type)
        
        total = query.count()

        transactions = (
            query
            .options(
                joinedload(Transaction.acc_1_r),
                joinedload(Transaction.acc_2_r)
            )
            .order_by(Transaction.date.desc())
            .offset(offset)
            .limit(page_size)
            .all()
        )

        total_pages = (total + page_size - 1) // page_size
        return {
            "transactions": transactions,
            "total_pages": total_pages
        }

    def delete_transaction(self, db: Session, id: str):

        transaction = db.query(Transaction).filter(
            Transaction.id == id
        ).first()

        if not transaction:
            return None

        if transaction.pair_id:

            transactions = db.query(Transaction).filter(
                Transaction.pair_id == transaction.pair_id
            ).all()

            for t in transactions:
                db.delete(t)

        else:
            db.delete(transaction)

        db.commit()

        return True
    
    def get_total_amount_by_account_type(self, db: Session, user_id: str, account_type: str):

        amount_case = case(
            (Transaction.type == "Income", Transaction.amount),

            (Transaction.type == "Expense", -Transaction.amount),

            (
                Transaction.type == "Transfer",
                case(
                    (Transaction.is_source == True, -Transaction.amount),
                    else_=Transaction.amount
                )
            ),

            else_=0
        )

        result = (
            db.query(func.sum(amount_case))
            .join(Transaction.acc_1_r)
            .filter(Transaction.user_id == user_id)
            .filter(Transaction.acc_1_r.has(type=account_type))
            .scalar()
        )

        return result or 0
    
    def update_transaction(self, db:Session, id: str, note: str):
        
        transaction = db.query(Transaction).filter(Transaction.id == id).first()
        
        transaction.note = note
        transaction.is_edited = True
        
        db.commit()
        return note
    
    
    def get_chart(self, db:Session, user_id: str):
        
        results = (
        db.query(
            Transaction.category,
            func.sum(Transaction.amount).label("total")
        )
        .filter(
            Transaction.user_id == user_id,
            Transaction.type == "Expense"
        )
        .group_by(Transaction.category)
        .all()
        )

        return [
            {
                "category": category,
                "amount": float(total)
            }
            for category, total in results
        ]