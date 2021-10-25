from django.db import models

# Create your models here.
# Student: 学号，姓名，性别，出生日期，手机号码，邮箱地址，家庭住址，照片


class Student(models.Model):
    gender_choices = (('m', 'm'), ('w', 'w'))
    sno = models.IntegerField(db_column='SNo', primary_key=True, null=False)
    name = models.CharField(db_column='SName', max_length=100, null=False)
    gender = models.CharField(db_column='Gender', max_length=100, choices=gender_choices)
    birthday = models.DateField(db_column='Birthday', null=False)
    mobile = models.CharField(db_column='Mobile', max_length=100)
    email = models.CharField(db_column='Email', max_length=100)
    address = models.CharField(db_column='Address', max_length=200)
    image = models.CharField(db_column='Image', max_length=200, null=True)

    # 自定义表名
    class Meta:
        managed = True
        db_table = 'Student'

    # __str__方法
    def __str__(self):
        return '学号:%s\t姓名:%s\t性别:%s\t' % (self.sno, self.name, self.gender)
