from django.db import models


class Update(models.Model):
    TYPE_CHOICES = [
        ('photo', 'Photo'),
        ('video', 'Video'),
        ('document', 'Document'),
        ('note', 'Note'),
    ]
    project = models.ForeignKey('projects.Project', on_delete=models.CASCADE, related_name='updates')
    uploaded_by = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    file = models.FileField(upload_to='updates/%Y/%m/', blank=True)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.project.name} - {self.type}"


class Comment(models.Model):
    update = models.ForeignKey(Update, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey('accounts.User', on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.author.username} on {self.update}"
