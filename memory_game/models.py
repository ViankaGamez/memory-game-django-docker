from django.db import models
from django.contrib.auth.models import User


class Partida(models.Model):

    NIVELES = [
        ('basico', 'Básico'),
        ('medio', 'Medio'),
        ('avanzado', 'Avanzado'),
    ]

    RESULTADOS = [
        ('ganada', 'Ganada'),
        ('perdida', 'Perdida'),
    ]

    usuario = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    nivel = models.CharField(
        max_length=10,
        choices=NIVELES
    )

    resultado = models.CharField(
        max_length=10,
        choices=RESULTADOS
    )

    tiempo_usado = models.PositiveIntegerField()

    intentos_restantes = models.PositiveIntegerField(
        default=0
    )

    fecha = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.usuario.username} - {self.resultado}"