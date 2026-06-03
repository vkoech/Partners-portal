import { Component, Input, OnInit, OnDestroy, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DataService, User } from '../../../services/data.service';
import { AuthService, AuthUser } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() headerClass = '';
  @Input() showBackButton = false;
  @Input() sidebarOpen = false;
  @Output() sidebarOpenChange = new EventEmitter<boolean>();

  private destroy$ = new Subject<void>();
  currentUser: User | null = null;
  dashboardMetrics: any;
  user: AuthUser | null = null;


  private authService = inject(AuthService);
  private router = inject(Router);
  private dataService = inject(DataService);

  ngOnInit() {
    // Subscribe to current user
    this.user= this.authService.getLoggedInUser();

    this.dataService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
      });

    // Get dashboard metrics if this is dashboard header
    if (this.headerClass === 'dashboard') {
      this.dashboardMetrics = this.dataService.getDashboardMetrics();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  goBack() {
    window.history.back();
  }

  logout() {
    // Clear any stored user data or tokens here if needed
    console.log('User logged out');
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    this.sidebarOpenChange.emit(this.sidebarOpen);
  }
}
