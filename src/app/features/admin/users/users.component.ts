import { Component, OnInit } from '@angular/core';
import { UserDto, UserStatus } from '../../../models/user/user.model';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserType } from '../../../enums/userType.enum';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  users: UserDto[] = [];
  filteredListings: UserDto[] = [];
  hasFarmers = false;
  loading = true;
  error = '';

  usersTypes = Object.values(UserType);
  selectedType = '';
  searchTerm = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = '';

    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredListings = data;  // Set initial filtered list
        this.hasFarmers = data.some(user => user.role === 'Farmer');
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users. Please try again later.';
        console.error("Error occurred while fetching users:", err);
        this.loading = false;
      }
    });
  }

  filterListings(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredListings = this.users.filter(user =>
      (!this.selectedType || user.role === this.selectedType) &&
      (!term || user.name.toLowerCase().includes(term))
    );
  }

  resetFilters(): void {
    this.selectedType = '';
    this.searchTerm = '';
    this.filterListings();
  }

  changeStatus(id: string): void {
    const user = this.users.find(u => u.id === id);
    if (!user) return;

    const originalStatus = user.status;
    user.status = user.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active;

    this.userService.changeStatus(id).subscribe({
      next: () => {
        // Success
      },
      error: (err: any) => {
        console.error("Error occurred while changing user status:", err);
        user.status = originalStatus; // Revert
        this.error = 'Failed to update user status. Please try again.';
      }
    });
  }
}
