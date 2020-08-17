import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompletedPage } from './completed.page';

describe('CompletedPage', () => {
  let component: CompletedPage;
  let fixture: ComponentFixture<CompletedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
