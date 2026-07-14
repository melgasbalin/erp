import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-modal.html'
})
export class AddModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() add = new EventEmitter<any>();

  addForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.addForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]*$')]]
    });
  }

  get f() { return this.addForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    
    // Simulate ID generation in the parent, just pass the data
    this.add.emit(this.addForm.value);
    this.onClose();
  }

  onClose() {
    this.addForm.reset();
    this.submitted = false;
    this.close.emit();
  }
}
