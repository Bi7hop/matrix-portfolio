import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss']
})
export class ThemeSwitcherComponent implements OnInit {
  themes: Theme[] = [];
  isOpen = false;
  currentTheme: Theme | null = null;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themes = this.themeService.getThemes();
    this.themeService.currentTheme$.subscribe(theme => {
      this.currentTheme = theme;
    });
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  selectTheme(themeName: string): void {
    this.themeService.setTheme(themeName as any);
    this.isOpen = false;
  }
}