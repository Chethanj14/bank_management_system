from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CustomerViewSet,
    AccountViewSet,
    TransactionViewSet,
    deposit,
    withdraw,
    transfer,
    export_transactions,
)

router = DefaultRouter()

router.register(
    r'customers',
    CustomerViewSet
)

router.register(
    r'accounts',
    AccountViewSet
)

router.register(
    r'transactions',
    TransactionViewSet
)

urlpatterns = router.urls + [

    # Deposit
    path(
        'deposit/',
        deposit,
        name='deposit'
    ),

    # Withdraw
    path(
        'withdraw/',
        withdraw,
        name='withdraw'
    ),

    # Transfer
    path(
        'transfer/',
        transfer,
        name='transfer'
    ),

    # Export Transactions CSV
    path(
        'export-transactions/',
        export_transactions,
        name='export-transactions'
    ),
]