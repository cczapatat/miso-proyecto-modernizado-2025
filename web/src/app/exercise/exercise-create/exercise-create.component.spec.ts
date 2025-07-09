import { DebugElement } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExerciseService } from "src/app/services/exercise.service";
import { ExerciseCreateComponent } from "./exercise-create.component";
import { RouterTestingModule } from "@angular/router/testing";
import { ToastrModule } from "ngx-toastr";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { of, throwError } from "rxjs";
import { ExerciseDto } from "src/app/dtos/exercise.dto";
import { By } from "@angular/platform-browser";

describe('ExerciseCreateComponent', () => {
  let component: ExerciseCreateComponent;
  let fixture: ComponentFixture<ExerciseCreateComponent>;
  let debug: DebugElement;
  let storeService: jasmine.SpyObj<ExerciseService>;

  beforeEach(async () => {
    const storeServiceSpy = jasmine.createSpyObj('ExerciseService', ['createExercise']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        TranslateService,
        { provide: ExerciseService, useValue: storeServiceSpy },
      ],
      declarations: [ExerciseCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseCreateComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement;

    storeService = TestBed.inject(ExerciseService) as jasmine.SpyObj<ExerciseService>;
  });

  /* beforeEach(() => {
    storeService.createExercise.and.returnValue(of(new ExerciseDto(
      'storeName',
      'storePhone',
      'storeEmail',
      'storeAddress',
      100,
      'ACTIVE',
      'HIGH',
      'uuid',
      new Date(),
      new Date(),
    )));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("Component has a title", () => {
    let title = debug.query(By.css('h2')).nativeElement;
    expect(title.innerHTML).toBeTruthy();
  });

  it("Component has a minimum items", () => {
    expect(debug.queryAll(By.css('#store_name'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_name_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_phone'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_phone_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_email'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_email_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_address'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_address_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_capacity'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_capacity_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_state'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_state_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_security_level'))).toHaveSize(1);
    expect(debug.queryAll(By.css('#store_security_level_error'))).toHaveSize(0);
    expect(debug.queryAll(By.css('#store_btn_register'))).toHaveSize(1);
  });

  it("Component has a error about store_name", () => {
    expect(debug.queryAll(By.css('#store_name_error'))).toHaveSize(0);
    component.exerciseForm.controls['name'].setValue('');
    component.exerciseForm.controls['name'].markAsTouched();

    const name = component.exerciseForm.controls['name'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_name')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_name_error'))).toHaveSize(1);
  });

  it("Component has a error about store_phone", () => {
    expect(debug.queryAll(By.css('#store_phone_error'))).toHaveSize(0);
    component.exerciseForm.controls['phone'].setValue('');
    component.exerciseForm.controls['phone'].markAsTouched();

    const name = component.exerciseForm.controls['phone'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_phone')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_phone_error'))).toHaveSize(1);
  });

  it("Component has a error about store_email", () => {
    expect(debug.queryAll(By.css('#store_email_error'))).toHaveSize(0);
    component.exerciseForm.controls['email'].setValue('');
    component.exerciseForm.controls['email'].markAsTouched();

    const name = component.exerciseForm.controls['email'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_email')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_email_error'))).toHaveSize(1);
  });

  it("Component has a error about store_address", () => {
    expect(debug.queryAll(By.css('#store_address_error'))).toHaveSize(0);
    component.exerciseForm.controls['address'].setValue('');
    component.exerciseForm.controls['address'].markAsTouched();

    const name = component.exerciseForm.controls['address'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_address')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_address_error'))).toHaveSize(1);
  });

  it("Component has a error about store_capacity", () => {
    expect(debug.queryAll(By.css('#store_capacity_error'))).toHaveSize(0);
    component.exerciseForm.controls['capacity'].setValue('');
    component.exerciseForm.controls['capacity'].markAsTouched();

    const name = component.exerciseForm.controls['capacity'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_capacity')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_capacity_error'))).toHaveSize(1);
  });

  it("Component has a error about store_state", () => {
    expect(debug.queryAll(By.css('#store_state_error'))).toHaveSize(0);
    component.exerciseForm.controls['state'].setValue('');
    component.exerciseForm.controls['state'].markAsTouched();

    const name = component.exerciseForm.controls['state'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_state')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_state_error'))).toHaveSize(1);
  });

  it("Component has a error about store_security_level", () => {
    expect(debug.queryAll(By.css('#store_security_level_error'))).toHaveSize(0);
    component.exerciseForm.controls['securityLevel'].setValue('');
    component.exerciseForm.controls['securityLevel'].markAsTouched();

    const name = component.exerciseForm.controls['securityLevel'];
    expect(name.valid).toBeFalsy();

    fixture.detectChanges();
    expect(name.hasError('required')).toBeTruthy();
    expect(debug.query(By.css('#store_security_level')).nativeElement.value).toEqual('');
    expect(debug.queryAll(By.css('#store_security_level_error'))).toHaveSize(1);
  });

  it("Component has a state select option", () => {
    const selectElement = debug.query(By.css('#store_state')).nativeElement;
    expect(selectElement).toBeTruthy();
    const options = selectElement.querySelectorAll('option');
    expect(options.length).toBe(3);
  });

  it("Component has a security level select option", () => {
    const selectElement = debug.query(By.css('#store_security_level')).nativeElement;
    expect(selectElement).toBeTruthy();
    const options = selectElement.querySelectorAll('option');
    expect(options.length).toBe(4);
  });

  it("Component action to submit button - success", () => {
    const submitButton = debug.query(By.css('#store_btn_register')).nativeElement;
    expect(submitButton).toBeTruthy();

    const form = component.exerciseForm;
    fixture.detectChanges();

    expect(form.valid).toBeFalsy();
    component.exerciseForm.controls['name'].setValue('Test Exercise');
    component.exerciseForm.controls['phone'].setValue('12345678901');
    component.exerciseForm.controls['email'].setValue('test@test.com');
    component.exerciseForm.controls['address'].setValue('Test Address');
    component.exerciseForm.controls['capacity'].setValue(100);
    component.exerciseForm.controls['state'].setValue('ACTIVE');
    component.exerciseForm.controls['securityLevel'].setValue('HIGH');
    fixture.detectChanges();
    expect(form.valid).toBeTruthy();
    expect(debug.query(By.css('#store_btn_register')).nativeElement.disabled).toBeFalsy();

    const button = debug.query(By.css('#store_btn_register'));
    button.nativeElement.click();

    fixture.detectChanges();
    expect(storeService.createExercise).toHaveBeenCalled();
    expect(storeService.createExercise.calls.count()).toBe(1);
    expect(storeService.createExercise.calls.argsFor(0)[0]).toEqual(new ExerciseDto(
      'Test Exercise',
      '12345678901',
      'test@test.com',
      'Test Address',
      100,
      'ACTIVE',
      'HIGH',
    ));
    expect(debug.query(By.css('#store_btn_register')).nativeElement.disabled).toBeTruthy();
  });

  it("Component action to submit button - empty", () => {
    const submitButton = debug.query(By.css('#store_btn_register')).nativeElement;
    expect(submitButton).toBeTruthy();

    const form = component.exerciseForm;
    fixture.detectChanges();

    expect(form.valid).toBeFalsy();
    component.exerciseForm.controls['name'].setValue('');
    component.exerciseForm.controls['phone'].setValue('');
    component.exerciseForm.controls['email'].setValue('');
    component.exerciseForm.controls['address'].setValue('');
    component.exerciseForm.controls['capacity'].setValue('');
    component.exerciseForm.controls['state'].setValue('');
    component.exerciseForm.controls['securityLevel'].setValue('');
    fixture.detectChanges();
    expect(form.valid).toBeFalsy();
    expect(debug.query(By.css('#store_btn_register')).nativeElement.disabled).toBeTruthy();

    const button = debug.query(By.css('#store_btn_register'));
    button.nativeElement.click();

    fixture.detectChanges();
    expect(storeService.createExercise.calls.count()).toBe(0);
  });

  it("Component action to submit button - service error", () => {
    storeService.createExercise.and.returnValue(throwError(() => new Error('Service failed')));

    const submitButton = debug.query(By.css('#store_btn_register')).nativeElement;
    expect(submitButton).toBeTruthy();

    const form = component.exerciseForm;
    fixture.detectChanges();

    component.exerciseForm.controls['name'].setValue('Test Exercise');
    component.exerciseForm.controls['phone'].setValue('12345678901');
    component.exerciseForm.controls['email'].setValue('test@test.com');
    component.exerciseForm.controls['address'].setValue('Test Address');
    component.exerciseForm.controls['capacity'].setValue(100);
    component.exerciseForm.controls['state'].setValue('ACTIVE');
    component.exerciseForm.controls['securityLevel'].setValue('HIGH');
    fixture.detectChanges();

    expect(form.valid).toBeTruthy();
    expect(debug.query(By.css('#store_btn_register')).nativeElement.disabled).toBeFalsy();

    const button = debug.query(By.css('#store_btn_register'));
    button.nativeElement.click();

    fixture.detectChanges();
    expect(storeService.createExercise).toHaveBeenCalled();
    expect(storeService.createExercise.calls.count()).toBe(1);
    expect(form.valid).toBeTruthy();
    expect(debug.query(By.css('#store_btn_register')).nativeElement.disabled).toBeFalsy();
  }); */
});
