import json

from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.db.models import Count, Avg

from .forms import RegistroForm
from .models import Partida


def registro(request):
    if request.method == 'POST':
        formulario = RegistroForm(request.POST)

        if formulario.is_valid():
            usuario = formulario.save()
            login(request, usuario)
            return redirect('inicio')
    else:
        formulario = RegistroForm()

    return render(request, 'memory_game/registro.html', {
        'formulario': formulario
    })


@login_required
def inicio(request):
    return render(request, 'memory_game/inicio.html')


@login_required
def juego(request, nivel):
    niveles = {
        'basico': {
            'nombre': 'Básico',
            'intentos': 6,
            'tiempo': 60
        },
        'medio': {
            'nombre': 'Medio',
            'intentos': 4,
            'tiempo': 45
        },
        'avanzado': {
            'nombre': 'Avanzado',
            'intentos': 2,
            'tiempo': 30
        }
    }

    if nivel not in niveles:
        return redirect('inicio')

    datos_nivel = niveles[nivel]
    datos_nivel['codigo'] = nivel

    return render(request, 'memory_game/juego.html', {
        'nivel': datos_nivel
    })

@login_required
@require_POST
def guardar_partida(request):

    datos = json.loads(request.body)

    Partida.objects.create(
        usuario=request.user,
        nivel=datos['nivel'],
        resultado=datos['resultado'],
        tiempo_usado=datos['tiempo_usado'],
        intentos_restantes=datos['intentos_restantes']
    )

    return JsonResponse({
        'guardado': True
    })

@login_required
def perfil(request):

    partidas = Partida.objects.filter(
        usuario=request.user
    ).order_by('-fecha')

    total_partidas = partidas.count()

    victorias = partidas.filter(
        resultado='ganada'
    ).count()

    derrotas = partidas.filter(
        resultado='perdida'
    ).count()

    promedio = partidas.aggregate(
        promedio=Avg('tiempo_usado')
    )['promedio']

    nivel_frecuente = (
        partidas
        .values('nivel')
        .annotate(total=Count('id'))
        .order_by('-total')
        .first()
    )

    nombres_niveles = {
        'basico': 'Básico',
        'medio': 'Medio',
        'avanzado': 'Avanzado'
    }

    if nivel_frecuente:
        nivel_mas_jugado = nombres_niveles.get(
            nivel_frecuente['nivel'],
            nivel_frecuente['nivel'].capitalize()
        )
    else:
        nivel_mas_jugado = 'Sin partidas'

    return render(request, 'memory_game/perfil.html', {
        'partidas': partidas,
        'total_partidas': total_partidas,
        'victorias': victorias,
        'derrotas': derrotas,
        'promedio': promedio,
        'nivel_mas_jugado': nivel_mas_jugado
    })