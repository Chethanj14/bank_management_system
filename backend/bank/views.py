from decimal import Decimal
import csv

from django.http import HttpResponse

from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Customer, Account, Transaction
from .serializers import (
    CustomerSerializer,
    AccountSerializer,
    TransactionSerializer
)


# ---------------- CUSTOMER API ---------------- #

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


# ---------------- ACCOUNT API ---------------- #

class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer


# ---------------- TRANSACTION API ---------------- #

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


# ---------------- DEPOSIT ---------------- #

@api_view(['POST'])
def deposit(request):
    account_number = request.data.get('account_number')
    amount = Decimal(request.data.get('amount'))

    account = Account.objects.get(
        account_number=account_number
    )

    account.balance += amount
    account.save()

    Transaction.objects.create(
        account=account,
        transaction_type='Deposit',
        amount=amount
    )

    return Response({
        "message": "Deposit Successful",
        "new_balance": str(account.balance)
    })


# ---------------- WITHDRAW ---------------- #

@api_view(['POST'])
def withdraw(request):

    account_number = request.data.get('account_number')
    amount = Decimal(request.data.get('amount'))

    account = Account.objects.get(
        account_number=account_number
    )

    if account.balance < amount:
        return Response(
            {
                "message": "Insufficient Balance"
            },
            status=400
        )

    account.balance -= amount
    account.save()

    Transaction.objects.create(
        account=account,
        transaction_type='Withdraw',
        amount=amount
    )

    return Response({
        "message": "Withdraw Successful",
        "new_balance": str(account.balance)
    })


# ---------------- TRANSFER ---------------- #

@api_view(['POST'])
def transfer(request):

    from_account_number = request.data.get(
        'from_account'
    )

    to_account_number = request.data.get(
        'to_account'
    )

    amount = Decimal(
        request.data.get('amount')
    )

    from_account = Account.objects.get(
        account_number=from_account_number
    )

    to_account = Account.objects.get(
        account_number=to_account_number
    )

    if from_account.balance < amount:
        return Response(
            {
                "message": "Insufficient Balance"
            },
            status=400
        )

    from_account.balance -= amount
    to_account.balance += amount

    from_account.save()
    to_account.save()

    Transaction.objects.create(
        account=from_account,
        transaction_type='Transfer',
        amount=amount
    )

    return Response({
        "message": "Transfer Successful",
        "sender_balance": str(
            from_account.balance
        ),
        "receiver_balance": str(
            to_account.balance
        )
    })


# ---------------- EXPORT CSV ---------------- #

@api_view(['GET'])
def export_transactions(request):

    response = HttpResponse(
        content_type='text/csv'
    )

    response[
        'Content-Disposition'
    ] = 'attachment; filename="transactions.csv"'

    writer = csv.writer(response)

    writer.writerow([
        'ID',
        'Transaction Type',
        'Amount',
        'Account Number'
    ])

    transactions = Transaction.objects.all()

    for transaction in transactions:

        writer.writerow([
            transaction.id,
            transaction.transaction_type,
            transaction.amount,
            transaction.account.account_number
        ])

    return response