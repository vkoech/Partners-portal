import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword implements AfterViewInit {
  @ViewChild('captchaCanvas', { static: false }) captchaCanvas!: ElementRef<HTMLCanvasElement>;

  employeeNumber = '';
  captchaAnswer = '';
  captchaQuestion = '';
  correctAnswer = 0;
  disableSubmit =false
  loading = false;
  ResetForm: FormGroup


  constructor(private router: Router, private fb: FormBuilder,
     private notificationService: NotificationService,
     private authService: AuthService) {}

   ngOnInit(): void {
    this.ResetForm = this.fb.group({
      emailAddress: ['', Validators.required],
      captchaAnswer: ['', Validators.required],
      passwordResetToken:['']
    });

    this.generateCaptcha();
  }


  ngAfterViewInit() {
    this.generateCaptcha();
  }

  generateCaptcha() {
    const canvas = this.captchaCanvas?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Generate random math problem
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let num1: number, num2: number, answer: number;

    switch (operation) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;
        answer = num1 + num2;
        break;
      case '-':
        num1 = Math.floor(Math.random() * 50) + 25;
        num2 = Math.floor(Math.random() * 25) + 1;
        answer = num1 - num2;
        break;
      case '*':
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
        answer = num1 * num2;
        break;
      default:
        num1 = 5;
        num2 = 3;
        answer = 8;
    }

    this.correctAnswer = answer;
    this.captchaQuestion = `${num1} ${operation} ${num2}`;

    // Add background noise
    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.1)`;
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    // Add noise lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.3)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Draw the math expression with distortion
    const expression = this.captchaQuestion;
    ctx.font = 'bold 28px Arial';
    ctx.fillStyle = '#214098';

    // Add text with slight rotation and positioning variations
    const letters = expression.split('');
    let x = 50;

    letters.forEach((letter, index) => {
      ctx.save();
      const rotation = (Math.random() - 0.5) * 0.4; // Random rotation between -0.2 and 0.2 radians
      const yOffset = (Math.random() - 0.5) * 10; // Random vertical offset

      ctx.translate(x, 55 + yOffset);
      ctx.rotate(rotation);
      ctx.fillText(letter, 0, 0);
      ctx.restore();

      x += ctx.measureText(letter).width + 5;
    });

    // Add more distortion dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(33, 64, 152, ${Math.random() * 0.3})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 3, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Clear the answer input
    this.captchaAnswer = '';
  }

  onReset() {
      this.loading= true
      const answerControl = this.ResetForm.get('captchaAnswer');
      const answerValue = answerControl?.value?.trim();
      const userAnswer = parseInt(answerValue || '', 10);
      if (isNaN(userAnswer) || userAnswer !== this.correctAnswer) {
        alert('Incorrect verification ANSWER. Please try again.');
        this.loading=false
        this.generateCaptcha();
        answerControl?.reset();
        return;
      }
      else{
      this.authService.resetPasswordLink(this.ResetForm.value.emailAddress, this.ResetForm.value.passwordResetToken) .subscribe({
          next: (res) => {
            this.loading = false;
            this.notificationService.success('', res.responseDescription);
            this.router.navigate(['/login']);
        },
        error: (err) => {
            this.loading = false;
            const message = err.error?.responseDescription;
            this.notificationService.warning('', message);
        }
      });
   }
  }

  backToLogin() {
    this.router.navigate(['/login']);
  }
}
