from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .models import Charge

def index(request):
    """Render the main page"""
    return render(request, 'charge_management/index.html')

def get_charges(request):
    """Get all charges as JSON"""
    charges = Charge.objects.all()
    data = [{
        'id': charge.id,
        'name': charge.name,
        'amount': str(charge.amount),
        'description': charge.description,
        'date_created': charge.date_created.strftime('%Y-%m-%d %H:%M')
    } for charge in charges]
    return JsonResponse({'charges': data})

@csrf_exempt
@require_http_methods(["POST"])
def create_charge(request):
    """Create a new charge"""
    try:
        data = json.loads(request.body)
        charge = Charge.objects.create(
            name=data['name'],
            amount=data['amount'],
            description=data.get('description', '')
        )
        return JsonResponse({
            'success': True,
            'charge': {
                'id': charge.id,
                'name': charge.name,
                'amount': str(charge.amount),
                'description': charge.description,
                'date_created': charge.date_created.strftime('%Y-%m-%d %H:%M')
            }
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@require_http_methods(["PUT"])
def update_charge(request, charge_id):
    """Update an existing charge"""
    try:
        charge = get_object_or_404(Charge, id=charge_id)
        data = json.loads(request.body)
        
        charge.name = data['name']
        charge.amount = data['amount']
        charge.description = data.get('description', '')
        charge.save()
        
        return JsonResponse({
            'success': True,
            'charge': {
                'id': charge.id,
                'name': charge.name,
                'amount': str(charge.amount),
                'description': charge.description,
                'date_created': charge.date_created.strftime('%Y-%m-%d %H:%M')
            }
        })
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_charge(request, charge_id):
    """Delete a charge"""
    try:
        charge = get_object_or_404(Charge, id=charge_id)
        charge.delete()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})