import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownlineComponent } from './downline.component';

describe('DownlineComponent', () => {
  let component: DownlineComponent;
  let fixture: ComponentFixture<DownlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
