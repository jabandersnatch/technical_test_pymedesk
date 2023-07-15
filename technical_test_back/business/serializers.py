from django.db.models.expressions import Decimal, fields
from rest_framework import serializers
from .models import Customer, Order, OrderItem, Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer):

    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), source='product', write_only=True)

    class Meta:
        model = OrderItem
        fields = '__all__'
        read_only_fields = ['batch_cost']

    def create(self, validated_data):
        order = validated_data.get('order')
        product = validated_data.get('product')
        quantity = validated_data.get('quantity')

        existing_item = OrderItem.objects.filter(order=order, product=product).first()

        if existing_item:
            existing_item.quantity += quantity
            existing_item.save()
            return existing_item
        else:
            return OrderItem.objects.create(**validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):

    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), source='customer', write_only=True)

    products = serializers.ListField(child=serializers.DictField(), required=False)
    total_cost = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['total_cost']

    def create(self, validated_data):
        products_data = validated_data.pop('products', [])
        order = Order.objects.create(**validated_data)
        total_cost = Decimal(0.0)

        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity')

            if product_id and quantity:
                product = Product.objects.get(id=product_id)
                print(f"product.cost = {product.cost}, type = {type(product.cost)}")
                print(f"quantity = {quantity}, type = {type(quantity)}")
                batch_cost = product.cost * quantity
                total_cost += batch_cost

                OrderItem.objects.create(order=order, product=product, quantity=quantity)

        order.total_cost = total_cost
        order.save()

        return order


    def update(self, instance, validated_data):
        products_data = validated_data.pop('products', [])
        instance.customer = validated_data.get('customer', instance.customer)
        instance.save()

        total_cost = Decimal(0.0)

        for product_data in products_data:
            product_id = product_data.get('product_id')
            quantity = product_data.get('quantity')

            if product_id and quantity:
                product = Product.objects.get(id=product_id)
                batch_cost = product.cost * quantity
                total_cost += batch_cost

                existing_item = OrderItem.objects.filter(order=instance, product=product).first()

                if existing_item:
                    existing_item.quantity += quantity
                    existing_item.save()
                else:
                    OrderItem.objects.create(order=instance, product=product, quantity=quantity)

        instance.total_cost = total_cost
        instance.save()

        return instance

class OrderListSerializer(serializers.ModelSerializer):

    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), source='customer', write_only=True)
    # The products of the order should display the OrderItem with its product, quantity and batch_cost
    products = OrderItemSerializer(many=True, source='orderitem_set', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'

class OrderDetailSerializer(serializers.ModelSerializer):

    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all(), source='customer', write_only=True)
    # The products of the order should display the OrderItem with its product, quantity and batch_cost
    products = OrderItemSerializer(many=True, source='orderitem_set', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'


