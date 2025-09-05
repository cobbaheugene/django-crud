document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('charge-form');
    const submitBtn = document.getElementById('submit-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const formTitle = document.getElementById('form-title');
    const chargesList = document.getElementById('charges-list');
    
    let editingChargeId = null;

    // Load charges on page load
    loadCharges();

    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            amount: parseFloat(document.getElementById('amount').value),
            description: document.getElementById('description').value
        };

        if (editingChargeId) {
            updateCharge(editingChargeId, formData);
        } else {
            createCharge(formData);
        }
    });

    // Cancel editing
    cancelBtn.addEventListener('click', function() {
        resetForm();
    });

    // Load all charges
    function loadCharges() {
        fetch('/api/charge_management/')
            .then(response => response.json())
            .then(data => {
                displayCharges(data.charges);
            })
            .catch(error => {
                console.error('Error loading charges:', error);
            });
    }

    // Display charges in the list
    function displayCharges(charges) {
        if (charges.length === 0) {
            chargesList.innerHTML = '<div class="no-charges">No charges found. Add your first charge above!</div>';
            return;
        }

        chargesList.innerHTML = charges.map(charge => `
            <div class="charge-item">
                <div class="charge-info">
                    <h3>${charge.name}</h3>
                    <p><strong>Description:</strong> ${charge.description || 'No description'}</p>
                    <p><strong>Created:</strong> ${charge.date_created}</p>
                </div>
                <div class="charge-amount">GHC ${charge.amount}</div>
                <div class="charge-actions">
                    <button class="edit-btn" onclick="editCharge(${charge.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteCharge(${charge.id})">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Create new charge
    function createCharge(data) {
        fetch('/api/charge_management/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                resetForm();
                loadCharges();
                alert('Charge created successfully!');
            } else {
                alert('Error creating charge: ' + result.error);
            }
        })
        .catch(error => {
            console.error('Error creating charge:', error);
            alert('Error creating charge');
        });
    }

    // Update charge
    function updateCharge(id, data) {
        fetch(`/api/charge_management/${id}/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                resetForm();
                loadCharges();
                alert('Charge updated successfully!');
            } else {
                alert('Error updating charge: ' + result.error);
            }
        })
        .catch(error => {
            console.error('Error updating charge:', error);
            alert('Error updating charge');
        });
    }

    // Edit charge (global function)
    window.editCharge = function(id) {
        fetch('/api/charge_management/')
            .then(response => response.json())
            .then(data => {
                const charge = data.charges.find(c => c.id === id);
                if (charge) {
                    document.getElementById('charge-id').value = charge.id;
                    document.getElementById('name').value = charge.name;
                    document.getElementById('amount').value = charge.amount;
                    document.getElementById('description').value = charge.description;
                    
                    editingChargeId = id;
                    formTitle.textContent = 'Edit Charge';
                    submitBtn.textContent = 'Update Charge';
                    cancelBtn.style.display = 'inline-block';
                    
                    // Scroll to form
                    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
                }
            });
    };

    // Delete charge (global function)
    window.deleteCharge = function(id) {
        if (confirm('Are you sure you want to delete this charge?')) {
            fetch(`/api/charge_management/${id}/delete/`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    loadCharges();
                    alert('Charge deleted successfully!');
                } else {
                    alert('Error deleting charge: ' + result.error);
                }
            })
            .catch(error => {
                console.error('Error deleting charge:', error);
                alert('Error deleting charge');
            });
        }
    };

    // Reset form
    function resetForm() {
        form.reset();
        editingChargeId = null;
        formTitle.textContent = 'Add New Charge';
        submitBtn.textContent = 'Add Charge';
        cancelBtn.style.display = 'none';
    }
});