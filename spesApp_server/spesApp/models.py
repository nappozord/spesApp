from django.db import models
from django.contrib.auth.models import User


# Create your models here
class Product(models.Model):
    name = models.CharField(max_length=20)
    cost = models.FloatField(default=0)
    duration = models.FloatField(default=0)
    lastUpdated = models.DateTimeField('last updated')
    user = models.ManyToManyField(User, blank=True)

    def __str__(self):
        return self.name

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "cost": self.cost,
            "duration": self.duration,
            "lastUpdated": str(self.lastUpdated)
        }


class Log(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    timeIn = models.DateTimeField('time in')
    timeOut = models.DateTimeField('time out', blank=True, null=True)

    def __str__(self):
        return self.product.name + " - " + str(self.timeIn)

    def to_dict(self):
        return {
            "id": self.id,
            "timeIn": str(self.timeIn),
            "timeOut": str(self.timeOut)
        }


class Option(models.Model):
    user = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE)
    weeklySpend = models.FloatField(default=30)
    weeklyShopping = models.FloatField(default=3)

    def __str__(self):
        return "Options - " + str(self.user.username)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.user.username,
            "weeklySpend": str(self.weeklySpend),
            "weeklyShopping": str(self.weeklyShopping)
        }
