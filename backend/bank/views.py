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
from django.contrib.auth.models import User
from rest_framework import status

from django.core.mail import send_mail
from django.conf import settings



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

    try:

        account_number = request.data.get('account_number')
        amount = request.data.get('amount')

        if not account_number:
            return Response(
                {"message": "Account number is required"},
                status=400
            )

        if not amount:
            return Response(
                {"message": "Amount is required"},
                status=400
            )

        amount = Decimal(str(amount))

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

        # Email temporarily disabled
        print("Deposit successful - Email skipped")

        return Response({
            "message": "Deposit Successful",
            "new_balance": str(account.balance)
        })

    except Account.DoesNotExist:

        return Response(
            {
                "message": "Account Not Found"
            },
            status=404
        )

    except Exception as e:

        return Response(
            {
                "message": str(e)
            },
            status=400
        )

# ---------------- WITHDRAW ---------------- #

@api_view(['POST'])
def withdraw(request):

    try:
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

        # Email disabled temporarily
        print(
            f"Withdraw: ₹{amount} from {account.account_number}"
        )

        return Response({
            "message": "Withdraw Successful",
            "new_balance": str(account.balance)
        })

    except Account.DoesNotExist:
        return Response(
            {
                "message": "Account Not Found"
            },
            status=404
        )

    except Exception as e:
        return Response(
            {
                "message": str(e)
            },
            status=400
        )


# ---------------- TRANSFER ---------------- #
# ---------------- TRANSFER ---------------- #

@api_view(['POST'])
def transfer(request):

    try:

        from_account_number = request.data.get('from_account')
        to_account_number = request.data.get('to_account')
        amount = request.data.get('amount')

        if not from_account_number:
            return Response(
                {"message": "From Account is required"},
                status=400
            )

        if not to_account_number:
            return Response(
                {"message": "To Account is required"},
                status=400
            )

        if not amount:
            return Response(
                {"message": "Amount is required"},
                status=400
            )

        amount = Decimal(str(amount))

        # Prevent self transfer
        if from_account_number == to_account_number:
            return Response(
                {
                    "message": "Cannot transfer to the same account"
                },
                status=400
            )

        from_account = Account.objects.get(
            account_number=from_account_number
        )

        to_account = Account.objects.get(
            account_number=to_account_number
        )

        # Check balance
        if from_account.balance < amount:
            return Response(
                {
                    "message": "Insufficient Balance"
                },
                status=400
            )

        # Update balances
        from_account.balance -= amount
        to_account.balance += amount

        from_account.save()
        to_account.save()

        # Transaction for sender
        Transaction.objects.create(
            account=from_account,
            transaction_type='Transfer Sent',
            amount=amount
        )

        # Transaction for receiver
        Transaction.objects.create(
            account=to_account,
            transaction_type='Transfer Received',
            amount=amount
        )

        # Email disabled temporarily
        print(
            f"Transfer Successful: ₹{amount} from "
            f"{from_account.account_number} "
            f"to {to_account.account_number}"
        )

        return Response({
            "message": "Transfer Successful",
            "sender_balance": str(from_account.balance),
            "receiver_balance": str(to_account.balance)
        })

    except Account.DoesNotExist:

        return Response(
            {
                "message": "Account Not Found"
            },
            status=404
        )

    except Exception as e:

        return Response(
            {
                "message": str(e)
            },
            status=400
        )

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

# ---------------- REGISTER ---------------- #

@api_view(['POST'])
def register(request):

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"message": "Username and Password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"message": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )

    return Response(
        {
            "message": "User Registered Successfully",
            "username": user.username
        },
        status=status.HTTP_201_CREATED
    )
# ---------------- CREATE CUSTOMER ---------------- #
@api_view(['POST'])
def create_customer(request):

    try:

        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        address = request.data.get('address')
        aadhaar_number = request.data.get('aadhaar_number')
        pan_number = request.data.get('pan_number')
        account_type = request.data.get('account_type')

        initial_deposit = Decimal(
            request.data.get('initial_deposit', 0)
        )

        # Duplicate Checks

        if Customer.objects.filter(
            email=email
        ).exists():

            return Response(
                {
                    "message": "Email Already Exists"
                },
                status=400
            )

        if Customer.objects.filter(
            aadhaar_number=aadhaar_number
        ).exists():

            return Response(
                {
                    "message": "Aadhaar Number Already Exists"
                },
                status=400
            )

        if Customer.objects.filter(
            pan_number=pan_number
        ).exists():

            return Response(
                {
                    "message": "PAN Number Already Exists"
                },
                status=400
            )

        # Create Customer

        customer = Customer.objects.create(
            name=name,
            email=email,
            phone=phone,
            address=address,
            aadhaar_number=aadhaar_number,
            pan_number=pan_number
        )

        # Create Account

        account = Account.objects.create(
            customer=customer,
            account_number=f"ACC{100000 + customer.id}",
            account_type=account_type,
            balance=initial_deposit
        )

        # Initial Deposit Transaction

        if initial_deposit > 0:

            Transaction.objects.create(
                account=account,
                transaction_type="Deposit",
                amount=initial_deposit
            )

        return Response({
            "message": "Customer Created Successfully",
            "account_number": account.account_number,
            "balance": str(account.balance)
        })

    except Exception as e:

        return Response(
            {
                "message": str(e)
            },
            status=500
        )