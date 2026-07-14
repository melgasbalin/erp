import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-modal.html'
})
export class EditModalComponent implements OnInit, OnChanges {
  @Input() registro: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  editForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.editForm = this.fb.group({
      id: [''],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.pattern('^[0-9]*$')]]
    });
  }

  ngOnInit() {
    if (this.registro) {
      this.editForm.patchValue(this.registro);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['registro'] && changes['registro'].currentValue) {
      this.editForm.patchValue(changes['registro'].currentValue);
    }
  }

  get f() { return this.editForm.controls; }

  onSubmit() {
    this.submitted = true;
    if (this.editForm.invalid) {
      return;
    }
    
    this.save.emit(this.editForm.value);
    this.onClose();
  }

  onClose() {
    this.submitted = false;
    this.close.emit();
  }
}
