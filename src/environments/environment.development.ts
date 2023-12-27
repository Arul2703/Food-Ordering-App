export const environment = {
  production: false,
  logLevel:'DEBUG',
  orderApiUrl: 'http://localhost:5038/api/Order',
  menuApiUrl: 'http://localhost:5038/api/Menu',
  baseUrl:'http://localhost:5038/api',
  apiUrls: {
    signup: '/Account/Signup',
    login: '/Account/Login',
    userProfile: '/Account/UserProfile',
    resendOtp: '/Account/ResendOtp',
    verifyOtp: '/Account/VerifyOtp',
    gallery: '/Gallery',
    cart: '/Cart',
    cartIncrease: '/cart/${itemId}/increase',
    cartDecrease: '/cart/${itemId}/decrease',
    checkout: '/Checkout', 
    payment: '/payment',
    categories: '/Categories',
    orderHistory: '/OrderHistory',
    log:'/logs',
    increaseQuantity:'/increase',
    decreaseQuantity:'/decrease',
    isEmailAvailable: '/Account/IsEmailAvailable'
  },
  httpHeaders: {
    contentType: 'Content-Type',
    json: 'application/json',
  },
  userProfileFields: {
    name: 'name',
    email: 'email',
    mobileNumber: 'mobileNumber',
    address: 'address',
    pincode: 'pincode',
    profilePicture: 'profilePicture',
    profileId: 'profileId',
    userid:'userid',
    base64Prefix: 'data:image/jpeg;base64,',
    profilePictureInput:'profilePictureInput'
  },
  cartDefaults: {
    cartId: 0,
    cartQuantity: 1,
  },
  messages: {
    updateUserProfileError: 'Failed to update user profile. Please try again later.',
    userProfileSuccess: 'User profile updated successfully.',
    loginSuccessful: 'Login successful!',
    invalidCredentials: 'Invalid login credentials',
    loginError: 'An error occurred while logging in',
    signupSuccess: 'Signup successful!',
    loginFailure:'An error occurred while logging in',
    signupError: 'Signup failed. Please try again.',
    unexpectedError: 'An unexpected error occurred. Please try again.',
    otpVerificationSuccess:'OTP Verified successfully, Please login to continue',
    otpVerificationFailure:'Invalid otp, Please enter correct OTP',
    useridUndefined: 'User information is not available. Please login again.',
    orderHistoryFailure:'Error fetching order history',
    menuFetchFailure:'Error occurred while retrieving food items:',
    checkoutFailure:'An error occurred while processing checkout',
    cartFetchFailure:'Failed to fetch cart items',
    userProfileFetchError: 'Error occurred while fetching user profile',
    userProfileFetchFailed: 'Failed to fetch user profile',
    resendOtpError: 'Failed to resend OTP. Please check your network connection and try again.',
    verifyOtpError: 'Failed to verify OTP. Please ensure the OTP is correct and try again.',
    cartIncreaseError: 'Failed to increase item quantity in the cart. Please try again.',
    cartDecreaseError: 'Failed to decrease item quantity in the cart. Please try again.',
    checkoutError: 'Oops! Something went wrong while processing the checkout. Please try again later.',
    paymentError: 'Oops! Something went wrong while processing the payment. Please try again later.',
    galleryFetchError: 'Error occurred while retrieving gallery items:',
    deleteFoodItemError: 'Oops! Failed to delete the food item. Please try again later.',
    editFoodItemError: 'Failed to update food item. Please try again later.',
    getFoodItemError: 'Failed to fetch food item. Please try again later.',
    addFoodItemError: 'Failed to add food item. Please try again later.',
    menuFetchError: 'Error occurred while retrieving food items. Please try again later.',
    getOrderHistoryError: 'Error fetching order history. Please try again later.',
    cartRemoveError: 'Failed to remove item from the cart. Please try again later.',
    orderSummaryError: 'Error fetching order summary. Please try again later.',
    orderSummaryMessageError: 'Error fetching order summary message. Please try again later.',
    errorCheckingEmailAvailability: 'Failed to check email availability. Please try again later.',
    loggerSuccessMessage:'Logged Successfully',
    loggerFailureMessage:'An error occurred while storing the log',
    cartAddSuccess: 'CartItem added to the cart.',
    cartIncreaseSuccess: 'CartItem quantity increased.',
    cartDecreaseSuccess: 'CartItem quantity decreased.',
    cartRemoveSuccess: 'CartItem removed from the cart.',
    menuFetchSuccess: 'Fetched menu items successfully.',
    addFoodItemSuccess: 'Food item added successfully.',
    editFoodItemSuccess: 'Food item edited successfully.',
    deleteFoodItemSuccess: 'Food item deleted successfully.',
    getFoodItemSuccess:'Food Item fetched successfully',
    getOrderHistorySuccess: 'Successfully fetched order history.',
    checkoutSuccess: 'Checkout successful.', 
    paymentSuccess: 'Payment successful.',
    galleryFetchSuccess: 'Fetched gallery items successfully.'
  },
  defaultFoodCategory:'All',
  userRoleLocalStorageKey: 'userRole', 
  serviceProvidedIn: 'root',
  userRoles: {
    admin: 'admin',
    user: 'user'
  },
  localStorageKeys: {
    token: 'token'
  },
  routes: {
    menu: '/menu',
    login:'/login',
    verifyOtp:'/verify-otp',
    addFoodItem:'/add-food-item',
    editFoodItem:'/edit-food-item',
    orderSummary:'/order-summary',
    menuList:'/menu-list',
    checkout:'/checkout',
  },
  authHeaders: {
    authorization: 'Authorization',
    bearerToken: 'Bearer',
  },
  Error:'Error',
  httpStatusCodes: {
    unauthorized: 401,
  },
  razorpay: {
    key: 'rzp_test_KzlAk2dbXmfpBB',
    currency: 'INR',
    restaurantName: 'Yum Spot Restaurant',
    orderDescription: 'Payment for Order',
    imageUrl: 'https://yumspotrestaurant.com',
    amountMultiplier: 100
  },
  dashboardCounts: {
    foodItemCount: 10,
    orderCount: 20,
    paymentCount: 30,
    userCount: 40
  },
  logLevels: {
    info: 'Information',
    warn: 'Warning',
    error: 'Error'
  }

};
