# GitHub Copilot Prompts for Angular Frontend Integration

Use these prompts in your Angular project to generate code for integrating with the NestJS backend APIs.

---

## 🔐 Authentication Service

### Prompt 1: Create Auth Service
```
Create an Angular authentication service with methods for login, register, logout, and getCurrentUser. 
Use HttpClient to call these endpoints:
- POST /auth/login with { email, password }
- POST /auth/register with { email, password, firstName, lastName }
- POST /auth/logout with Authorization header
- GET /auth/me with Authorization header

Store the JWT token in sessionStorage and include it in protected requests. 
Use environment.apiUrl as base URL. Include proper TypeScript interfaces for requests and responses.
Add error handling with RxJS catchError.
```

### Prompt 2: Create Auth Interceptor
```
Create an Angular HTTP interceptor that automatically adds the JWT token from sessionStorage 
to the Authorization header for all outgoing requests. If the token exists, add "Bearer " + token 
to the Authorization header. Handle 401 errors by redirecting to login page and clearing the token.
```

### Prompt 3: Update Auth Guard
```
Update the Angular auth guard to check if a valid JWT token exists in sessionStorage. 
If not authenticated, redirect to /login. Optionally call the /auth/me endpoint to verify 
the token is still valid. Use CanActivate interface and return Observable<boolean>.
```

---

## 🏋️ Training/Exercise Service

### Prompt 4: Create Training Service
```
Create an Angular service for exercise management with these methods:
- getAvailableExercises(): Observable<Exercise[]> - GET /exercises/available (no auth needed)
- addFinishedExercise(exercise: CreateFinishedExerciseRequest): Observable<FinishedExercise> - POST /exercises/finished with Authorization
- getFinishedExercises(): Observable<FinishedExercise[]> - GET /exercises/finished with Authorization

Use HttpClient and environment.apiUrl. Include TypeScript interfaces:
- Exercise: { id, name, duration, calories }
- FinishedExercise: extends Exercise with { userId, date, state: 'completed' | 'cancelled' }
- CreateFinishedExerciseRequest: { name, duration, calories, date: string, state }

Add proper error handling and return typed observables.
```

---

## 🗄️ NgRx Store Integration

### Prompt 5: Create Auth Actions
```
Create NgRx actions for authentication using createAction and props:
- loginRequest with email and password
- loginSuccess with access_token and user
- loginFailure with error message
- registerRequest with email, password, firstName, lastName
- registerSuccess with access_token and user
- registerFailure with error
- logout
- getCurrentUser
- getCurrentUserSuccess with user data
- getCurrentUserFailure with error

Group them in an auth.actions.ts file.
```

### Prompt 6: Create Auth Effects
```
Create NgRx effects for authentication that:
1. Listen to loginRequest, call authService.login(), dispatch loginSuccess or loginFailure
2. Listen to registerRequest, call authService.register(), dispatch registerSuccess or registerFailure
3. On loginSuccess/registerSuccess, save token to sessionStorage and navigate to /training
4. Listen to logout, call authService.logout(), clear sessionStorage, navigate to /login
5. Listen to getCurrentUser, call authService.getCurrentUser(), dispatch success or failure

Use createEffect, ofType, switchMap, map, catchError, and tap operators. 
Inject Router, AuthService, and Actions.
```

### Prompt 7: Create Auth Reducer
```
Create an NgRx reducer for authentication state with:
- State interface: { user: User | null, token: string | null, isLoading: boolean, error: string | null }
- Initial state with all null values
- Handle loginRequest/registerRequest: set isLoading true, clear error
- Handle loginSuccess/registerSuccess: set user, token, isLoading false
- Handle loginFailure/registerFailure: set error, isLoading false
- Handle logout: reset to initial state
- Handle getCurrentUserSuccess: update user data

Use createReducer and on() from @ngrx/store.
```

### Prompt 8: Create Training Actions
```
Create NgRx actions for training/exercises:
- loadAvailableExercises
- loadAvailableExercisesSuccess with exercises array
- loadAvailableExercisesFailure with error
- startTraining with selected exercise
- completeTraining with exercise data
- cancelTraining with exercise data
- addFinishedExercise with CreateFinishedExerciseRequest
- addFinishedExerciseSuccess with saved exercise
- addFinishedExerciseFailure with error
- loadFinishedExercises
- loadFinishedExercisesSuccess with exercises array
- loadFinishedExercisesFailure with error

Use createAction and props.
```

### Prompt 9: Create Training Effects
```
Create NgRx effects for training that:
1. Load available exercises on app init, call trainingService.getAvailableExercises()
2. On completeTraining, create finished exercise with state 'completed', call addFinishedExercise
3. On cancelTraining, create finished exercise with state 'cancelled', call addFinishedExercise
4. On addFinishedExercise, call trainingService.addFinishedExercise(), dispatch success or failure
5. Load finished exercises when needed, call trainingService.getFinishedExercises()

Use proper date formatting (new Date().toISOString()). Handle errors with catchError.
```

### Prompt 10: Create Training Reducer
```
Create an NgRx reducer for training state with:
- State: { availableExercises: Exercise[], finishedExercises: FinishedExercise[], 
  activeExercise: Exercise | null, isLoading: boolean, error: string | null }
- Handle loadAvailableExercises: set isLoading true
- Handle loadAvailableExercisesSuccess: set availableExercises, isLoading false
- Handle startTraining: set activeExercise
- Handle completeTraining/cancelTraining: clear activeExercise
- Handle loadFinishedExercisesSuccess: set finishedExercises
- Handle addFinishedExerciseSuccess: add to finishedExercises array

Use createReducer and on().
```

---

## 🎨 Component Integration

### Prompt 11: Update Login Component
```
Update the login component to dispatch loginRequest action on form submit.
Use template-driven or reactive forms with email and password fields.
Subscribe to auth state from store to show loading spinner and error messages.
On successful login (when token exists in state), navigation is handled by effects.
Add validation: email required and valid format, password required and min 6 characters.
```

### Prompt 12: Update Signup Component
```
Update the signup component to dispatch registerRequest action with email, password, firstName, lastName.
Use reactive forms with validation:
- email: required, valid email format
- password: required, min 6 characters
- firstName: required
- lastName: required

Subscribe to auth state to show loading and errors. Show success message or navigate on success.
```

### Prompt 13: Update New Training Component
```
Update the new training component to:
1. Dispatch loadAvailableExercises on init
2. Subscribe to availableExercises from store
3. Display exercises in a list or cards with name, duration, and calories
4. On exercise selection, dispatch startTraining action with selected exercise
5. Navigate to /training (current-training page) after selection

Show loading spinner while fetching exercises.
```

### Prompt 14: Update Current Training Component
```
Update the current training component to:
1. Subscribe to activeExercise from store
2. Display exercise details (name, duration, calories)
3. Implement countdown timer for exercise duration
4. On timer complete, show complete/cancel buttons
5. On complete, dispatch completeTraining with exercise data and current date
6. On cancel, dispatch cancelTraining with exercise data and current date
7. Navigate back to /training after completion

Use interval or timer observable for countdown.
```

### Prompt 15: Update Past Trainings Component
```
Update the past trainings component to:
1. Dispatch loadFinishedExercises on init
2. Subscribe to finishedExercises from store
3. Display exercises in a Material table or list with columns:
   - Exercise name
   - Duration
   - Calories
   - Date (formatted)
   - State (completed/cancelled with different colors)
4. Add sorting and filtering capabilities
5. Calculate total statistics: total exercises, total calories, total duration

Use Angular Material table with mat-table, mat-sort, mat-paginator.
```

---

## 🔧 Utilities

### Prompt 16: Create HTTP Error Handler
```
Create an Angular service for centralized HTTP error handling.
Include a method that takes HttpErrorResponse and returns user-friendly error messages.
Handle specific status codes:
- 400: Validation errors - extract message array
- 401: "Please login again"
- 403: "Access denied"
- 404: "Resource not found"
- 409: "Resource already exists"
- 500: "Server error, please try again"

Use this in services' catchError operators.
```

### Prompt 17: Create Token Helper
```
Create a token helper utility with static methods:
- setToken(token: string): void - save to sessionStorage
- getToken(): string | null - retrieve from sessionStorage
- removeToken(): void - clear from sessionStorage
- isTokenExpired(): boolean - decode JWT and check exp claim
- getTokenPayload(): any - decode and return payload

Install and use jwt-decode library for JWT parsing.
```

### Prompt 18: Update Environment Interface
```
Create a TypeScript interface for environment configuration:
- production: boolean
- apiUrl: string
- tokenKey: string (default: 'access_token')

Update environment.ts and environment.prod.ts to implement this interface.
Use this in services instead of hardcoding values.
```

---

## 🧪 Testing Prompts

### Prompt 19: Create Auth Service Tests
```
Create Jasmine unit tests for AuthService using HttpClientTestingModule.
Test each method (login, register, logout, getCurrentUser):
- Mock HttpClient responses
- Verify correct endpoints are called
- Verify request bodies and headers
- Test success and error scenarios
- Verify token storage in sessionStorage

Use expectOne, flush, and verify for HttpTestingController.
```

### Prompt 20: Create Training Service Tests
```
Create Jasmine unit tests for TrainingService:
- Test getAvailableExercises returns Exercise array
- Test addFinishedExercise sends correct data with auth header
- Test getFinishedExercises requires authentication
- Mock HTTP responses and verify observables emit correct values
- Test error handling scenarios

Use HttpClientTestingModule and HttpTestingController.
```

---

## 📦 Quick Setup Script

### Prompt 21: Generate All Auth Files
```
Generate complete authentication module for Angular with:
1. AuthService with login, register, logout, getCurrentUser methods
2. HTTP interceptor to add JWT token to headers
3. Auth guard to protect routes
4. Login component with reactive form
5. Register component with validation
6. Token helper utility
7. TypeScript interfaces for all auth-related types

Use Angular CLI generate commands and implement each file following best practices.
Structure: src/app/auth/ folder with all auth-related files.
```

### Prompt 22: Generate Complete Training Module
```
Generate training/exercise module with:
1. TrainingService with methods for available and finished exercises
2. NgRx store setup: actions, effects, reducer, selectors
3. Components: new-training, current-training, past-trainings
4. Material table for displaying past trainings
5. Timer component for active training
6. Exercise card component for displaying available exercises

Structure: src/app/training/ folder. Use Angular Material components.
```

---

## 🚀 Usage Instructions

1. **Copy a prompt** from above
2. **Open the relevant file** in VS Code (or create new one)
3. **Trigger GitHub Copilot Chat** (Ctrl+I or Cmd+I)
4. **Paste the prompt** and let Copilot generate the code
5. **Review and adjust** the generated code as needed

## 💡 Tips

- Use prompts **sequentially** (start with services, then NgRx, then components)
- **Review generated code** for your specific use cases
- **Customize** field names if your frontend models differ
- **Test incrementally** after each prompt
- Prompts assume **Angular 17+, standalone components optional, NgRx 19+**

## 📝 Example Copilot Chat Usage

```
You: [Paste Prompt 4 about Training Service]

Copilot: [Generates TrainingService with all methods]

You: Now add retry logic with exponential backoff for failed requests

Copilot: [Updates service with retry operators]
```

Happy coding! 🎉
