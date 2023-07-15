from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import OrderItem, Order

@receiver([post_save, post_delete], sender=OrderItem)
def update_order(sender, instance, **kwargs):
    order = instance.order.id

    items = OrderItem.objects.filter(order=order)

    order.items = [[item.product.name, item.quantity, item.product.cost, item.product.cost * item.quantity] for item in items]

    # The OrderItem has an attribute called batch_cost, which is the cost of the batch of products
    order.total_cost = sum([item.batch_cost for item in items])

    order.save()
