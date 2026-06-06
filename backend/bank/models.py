from django.db import models


class Customer(models.Model):

    name = models.CharField(max_length=100)

    email = models.EmailField(
        unique=True
    )

    phone = models.CharField(
        max_length=15
    )

    address = models.TextField()

    aadhaar_number = models.CharField(
        max_length=12,
        unique=True,
        null=True,
        blank=True
    )

    pan_number = models.CharField(
        max_length=10,
        unique=True,
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name


class Account(models.Model):

    customer = models.ForeignKey(
        Customer,
        on_delete=models.CASCADE
    )

    account_number = models.CharField(
        max_length=20,
        unique=True
    )

    account_type = models.CharField(
        max_length=20
    )

    balance = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return self.account_number


class Transaction(models.Model):

    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE
    )

    transaction_type = models.CharField(
        max_length=20
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.transaction_type} - {self.amount}"