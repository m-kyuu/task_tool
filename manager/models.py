from django.db import models

STAFF_CHOICE = (
    ('きゅう', 'きゅう'),
    ('スタッフA', 'スタッフA'),
    ('スタッフB', 'スタッフB'),
)

STATUS_CHOICE = (
    ('着手', '着手'),
    ('実装', '実装'),
    ('完了', '完了'),
)


class Task(models.Model):
    start_date = models.DateField('開始日', blank=True)
    staff = models.CharField('担当者', max_length=100, choices=STAFF_CHOICE, default='きゅう', blank=False)
    title = models.CharField('内容', max_length=100, blank=True)
    status = models.CharField('ステータス', max_length=100, choices=STATUS_CHOICE, default='着手', blank=False)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, blank=True)


class Project(models.Model):
    name = models.CharField(max_length=100)
    detail = models.CharField(max_length=255)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name


