import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    standalone: true,
    imports: [CommonModule],
    selector: 'app-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrl: './confirmation-modal.component.scss'
})
export class ConfirmationModalComponent {
    @Input() title = 'Confirm';
    @Input() message = 'Are you sure?';
    @Input() confirmText = 'Confirm';
    @Input() cancelText = 'Cancel';
    @Input() confirmClass = 'btn-primary';

    constructor(public activeModal: NgbActiveModal) { }

    confirm(): void {
        this.activeModal.close('confirm');
    }

    cancel(): void {
        this.activeModal.dismiss('cancel');
    }
}
