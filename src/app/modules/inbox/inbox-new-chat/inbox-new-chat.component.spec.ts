import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InboxNewChatComponent } from './inbox-new-chat.component';

describe('InboxNewChatComponent', () => {
  let component: InboxNewChatComponent;
  let fixture: ComponentFixture<InboxNewChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InboxNewChatComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InboxNewChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
