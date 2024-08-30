import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionDialogComponent } from './instruction-dialog.component';

describe('InstructionPageComponent', () => {
  let component: InstructionDialogComponent;
  let fixture: ComponentFixture<InstructionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstructionDialogComponent]
    });
    fixture = TestBed.createComponent(InstructionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
