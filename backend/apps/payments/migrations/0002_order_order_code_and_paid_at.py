# Generated manually

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='order_code',
            field=models.CharField(db_index=True, default='', max_length=50, unique=True),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='order',
            name='paid_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]


