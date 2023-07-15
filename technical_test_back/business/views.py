from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Count, Sum
from rest_framework import viewsets
from .models import Customer, Order, OrderItem, Product
from .serializers import CustomerSerializer, OrderSerializer, OrderListSerializer, OrderDetailSerializer, OrderItemSerializer, ProductSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all().order_by('id')
    serializer_class = CustomerSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().order_by('-date', 'id')
    serializer_class = OrderSerializer
    list_serializer_class = OrderListSerializer
    detail_serializer_class = OrderDetailSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return self.list_serializer_class
        elif self.action == 'retrieve':
            return self.detail_serializer_class
        return super().get_serializer_class()

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all().order_by('id')
    serializer_class = OrderItemSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer

@api_view(['GET'])
def summary(request) -> Response:
    num_orders = Order.objects.count()
    num_customers = Customer.objects.count()
    last_month_income = Order.objects.filter(date__year=datetime.now().year, date__month=datetime.now().month-1).aggregate(total=Sum('total_cost'))['total']
    city_with_most_orders = Order.objects.values('customer__city').annotate(orders=Count('customer__city')).order_by('-orders').first()
    best_selling_product = OrderItem.objects.values('product__name').annotate(sales=Sum('quantity')).order_by('-sales').first()

    return Response({
        'num_orders': num_orders,
        'num_customers': num_customers,
        'last_month_income': last_month_income,
        'city_with_most_orders': city_with_most_orders['customer__city'] if city_with_most_orders else None,
        'best_selling_product': best_selling_product['product__name'] if best_selling_product else None,
    })

