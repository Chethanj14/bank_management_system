from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    CustomerViewSet,
    AccountViewSet,
    TransactionViewSet,
    create_admin,
    deposit,
    withdraw,
    transfer,
    export_transactions,
    create_customer,
    register,
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
    
    # Register
    path(
        'register/',
        register,
        name='register'
    ),

    # Create Customer
    path(
        'create-customer/',
        create_customer,
        name='create-customer'
    ),

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

    path('create-admin/', create_admin),

]