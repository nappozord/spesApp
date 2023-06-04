from datetime import datetime

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes

from .models import *
import json
from rest_framework.permissions import IsAuthenticated


def add_product(body, user):
    if body["duration"] == "":
        body["duration"] = 0
    product = Product(
        name=body["name"],
        cost=format(float(body["cost"]), ".2f"),
        lastUpdated=datetime.strptime(body["lastUpdated"], "%Y-%m-%dT%H:%M:%S.%fZ"),
        duration=format(float(body["duration"]), ".2f"),
    )

    product.save()
    product.user.add(user)
    product.save()

    return JsonResponse(
        json.loads(json.dumps({"body": "ok"}))
    )


def update_product(body, user, product_name):
    if body["duration"] == "":
        body["duration"] = 0

    product = Product.objects.get(user=user, name=product_name)
    product.name = body["name"]
    product.cost = format(float(body["cost"]), ".2f")
    product.lastUpdated = datetime.strptime(body["lastUpdated"], "%Y-%m-%dT%H:%M:%S.%fZ")
    product.duration = format(float(body["duration"]), ".2f")

    product.save()

    return JsonResponse(
        json.loads(json.dumps({"body": "ok"}))
    )


def add_log(body, user, product):
    time_out = None
    if body["timeOut"]:
        time_out = datetime.strptime(body["timeOut"], "%Y-%m-%dT%H:%M:%S.%fZ")

    log = Log(
        timeIn=datetime.strptime(body["timeIn"], "%Y-%m-%dT%H:%M:%S.%fZ"),
        product=product,
        timeOut=time_out,
        user=user
    )

    log.save()

    return JsonResponse(
        json.loads(json.dumps({"body": "ok"}))
    )


def update_log(body, user, product):
    time_out = None
    if body["timeOut"]:
        time_out = datetime.strptime(body["timeOut"], "%Y-%m-%dT%H:%M:%S.%fZ")

    log = Log.objects.get(
        user=user,
        product=product,
        timeIn=datetime.strptime(body["timeIn"], "%Y-%m-%dT%H:%M:%S.%fZ"),
    )
    log.timeOut = time_out
    log.save()

    return JsonResponse(
        json.loads(json.dumps({"body": "ok"}))
    )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def products_actions(request):
    user = request.user
    data_set = []

    if request.method == 'GET':
        for product in Product.objects.filter(user=user):
            logs = Log.objects.filter(product=product, user=user)
            result = [obj.to_dict() for obj in logs]
            prod = product.to_dict()
            prod["logs"] = result
            data_set.append(prod)

        return JsonResponse(
            json.loads(json.dumps({"body": data_set}))
        )
    else:
        body = json.loads(request.body)
        if Product.objects.filter(user=user, name=body["name"]).count() == 1:
            return update_product(body, user, body["name"])
        else:
            return add_product(body, user)


@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def product_actions(request, product_name):
    user = request.user

    if request.method == 'PUT':
        body = json.loads(request.body)
        if Product.objects.filter(user=user, name=product_name).count() == 1:
            return update_product(body, user, product_name)
        else:
            return add_product(body, user)
    elif Product.objects.filter(user=user, name=product_name).count() == 1:
        product = Product.objects.get(user=user, name=product_name)
        product.delete()
        return JsonResponse(
            json.loads(json.dumps({"body": "ok"}))
        )


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def logs_actions(request, product_name):
    user = request.user
    data_set = []

    if Product.objects.filter(user=user, name=product_name).count() == 1:
        product = Product.objects.get(user=user, name=product_name)
        if request.method == 'GET':
            for log in Log.objects.filter(user=user, product=product):
                data_set.append(log.to_dict())

            return JsonResponse(
                json.loads(json.dumps({"body": data_set}))
            )
        else:
            body = json.loads(request.body)
            if Log.objects.filter(user=user, product=product,
                                  timeIn=datetime.strptime(body["timeIn"], "%Y-%m-%dT%H:%M:%S.%fZ")).count() == 1:
                return update_log(body, user, product)
            else:
                return add_log(body, user, product)
    else:
        return JsonResponse(
            json.loads(json.dumps({"body": "fail"}))
        )


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def log_actions(request, product_name, log_time_in):
    user = request.user
    body = json.loads(request.body)

    if Product.objects.filter(user=user, name=product_name).count() == 1:
        product = Product.objects.get(user=user, name=product_name)
        if Log.objects.filter(user=user, product=product,
                              timeIn=datetime.strptime(log_time_in, "%Y-%m-%dT%H:%M:%S.%fZ")).count() == 1:
            return update_log(body, user, product)
        else:
            return add_log(body, user, product)
    else:
        return JsonResponse(
            json.loads(json.dumps({"body": "fail"}))
        )


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def option_actions(request):
    user = request.user
    option = Option.objects.get(user=user)

    if request.method == 'GET':
        return JsonResponse(
            json.loads(json.dumps({"body": option.to_dict()}))
        )
    elif request.method == 'PUT':
        body = json.loads(request.body)
        option.weeklySpend = format(float(body["weeklySpend"]), ".2f")
        option.weeklyShopping = format(float(body["weeklyShopping"]), ".2f")
        option.save()
        return JsonResponse(
            json.loads(json.dumps({"body": "ok"}))
        )
