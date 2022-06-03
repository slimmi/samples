import { Component, Input } from '@angular/core';
import { Approver } from '../../../redux';
import { Quote } from '../../../core/models/quote.model';
import { DEAL_QUALIFICATION, QUOTE_APPROVAL_STATUS } from '../../../constants';

@Component({
  selector: 'approver-button',
  templateUrl: './approver-button.component.html',
  styleUrls: ['./approver-button.component.css']
})
export class ApproverButtonComponent {

  @Input()
  public quote: Quote;

  @Input()
  public approvers: Approver[];

  public isApproversOpen = false;

  public constructor() {}

  public get isApprovalRequired(): boolean {
    return this.quote?.approveStatus === QUOTE_APPROVAL_STATUS.REQUIRED;
  }

  public get approverName(): string {
    const approver = this.approvers?.find(a => a.notificationType === DEAL_QUALIFICATION.NOTIFICATION_TYPE.APPROVAL);
    return approver?.approverName || DEAL_QUALIFICATION.APPROVAL.REQUIRED;
  }

  public openApproversModal(): void {
    this.isApproversOpen = this.isApprovalRequired;
  }

}
