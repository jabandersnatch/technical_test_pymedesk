from django.db import models

class Product(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=200)
    cost = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name

class Customer(models.Model):
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    phone = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    city = models.CharField(max_length=200)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('P', 'Pending'),
        ('R', 'In Progress'),
        ('D', 'Delivered'),
        ('C', 'Cancelled'),
    ]

    DELIVERY_CHOICES = [
        ('H', 'Home Delivery'),
        ('P', 'Pickup'),
    ]

    id = models.AutoField(primary_key=True)
    date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=STATUS_CHOICES, default='P')
    paid = models.BooleanField(default=False)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    delivery_rule = models.CharField(max_length=1, choices=DELIVERY_CHOICES, default='H')
    observations = models.CharField(max_length=200, blank=True)
    total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        # get all order items
        order_items = OrderItem.objects.filter(order=self.id)
        # calculate total total_cost
        total_cost = 0
        for item in order_items:
            total_cost += item.batch_cost
        self.total_cost = total_cost
        super(Order, self).save(*args, **kwargs)


    def __str__(self):
        return str(self.id) + ' ' + str(self.customer)

class OrderItem(models.Model):
    id = models.AutoField(primary_key=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    batch_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def save(self, *args, **kwargs):
        self.batch_cost = self.product.cost * self.quantity
        super(OrderItem, self).save(*args, **kwargs)

    def __str__(self):
        return str(self.product) + ' ' + str(self.order.id) + ' ' + str(self.quantity)
