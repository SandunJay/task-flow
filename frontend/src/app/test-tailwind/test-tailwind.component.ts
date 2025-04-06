import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test-tailwind',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-100 p-8">
      <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">
        <h2 class="text-2xl font-bold text-indigo-600 mb-4">Tailwind CSS Test</h2>
        <p class="text-gray-500 mb-4">This component uses Tailwind CSS classes</p>
        <button class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
          Test Button
        </button>
        <a [routerLink]="['/login']" class="mt-8 text-indigo-600 hover:text-indigo-800">Back to Login</a>
      </div>
    </div>
  `,
})
export class TestTailwindComponent {}
