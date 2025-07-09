import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let translateService: TranslateService;
  let router: Router;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      declarations: [HeaderComponent],
      providers: [
        TranslateService,
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    translateService = TestBed.inject(TranslateService);
    router = TestBed.inject(Router);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show admin menu when user is admin', () => {
    localStorage.setItem('type', 'ADMIN');
    fixture.detectChanges();

    const adminSection = fixture.debugElement.query(By.css('.menu-section h3'));
    expect(adminSection.nativeElement.textContent.trim()).toContain('NAV.MODULES');

    const adminMenuItems = fixture.debugElement.queryAll(By.css('.menu-section:first-child .nav-item'));
    expect(adminMenuItems.length).toBeGreaterThan(0);
  });

  it('should not show admin menu when user is not admin', () => {
    localStorage.setItem('type', 'SELLER');
    fixture.detectChanges();

    const adminSection = fixture.debugElement.queryAll(By.css('.menu-section h3'));
    expect(adminSection[0].nativeElement.textContent).not.toContain('NAV.ADMIN');
  });

  it('should hide menu when hideMenu is called', () => {
    component.isMenuVisible = true;
    component.hideMenu();
    expect(component.isMenuVisible).toBeFalse();
  });

  it('should toggle menu when toggleMenu is called', () => {
    expect(component.isMenuVisible).toBeFalse();
    component.toggleMenu();
    expect(component.isMenuVisible).toBeTrue();
    component.toggleMenu();
    expect(component.isMenuVisible).toBeFalse();
  });

  it('should navigate to specific route and hide menu', () => {
    const navigateSpy = spyOn(router, 'navigate');
    const testRoute = '/test-route';

    component.isMenuVisible = true;
    component.navigate(testRoute);

    expect(navigateSpy).toHaveBeenCalledWith([testRoute]);
    expect(component.isMenuVisible).toBeFalse();
  });

  it('should change language when changeLanguage is called', () => {
    const translateSpy = spyOn(translateService, 'use');
    const newLang = 'en-UK';

    component.changeLanguage(newLang);

    expect(component.currentLang).toBe(newLang);
    expect(translateSpy).toHaveBeenCalledWith(newLang);
  });

  it('should initialize with browser language if available', () => {
    const testLang = 'es-AR';
    spyOnProperty(navigator, 'language').and.returnValue(testLang);

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.currentLang).toBe('es-CO');
  });

  it('should initialize with default language if browser language not supported', () => {
    spyOnProperty(navigator, 'language').and.returnValue('fr-FR');

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();

    expect(component.currentLang).toBe('es-CO');
  });
});
