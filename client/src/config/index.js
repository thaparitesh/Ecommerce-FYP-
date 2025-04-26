


export const registerFormControls = [
    {
        name: 'userName',
        label : 'User Name',
        placeholder : 'Enter your user name',
        componentType : 'input',
        type : 'text',

    },
    {
        name: 'email',
        label : 'Email',
        placeholder : 'Enter your email',
        componentType : 'input',
        type : 'email',

    },
    {
        name: 'phoneNumber',
        label : 'Phone number',
        placeholder : 'Enter your phone number',
        componentType : 'input',
        type : 'text',

    },
    
    {
        name: 'password',
        label : 'Password',
        placeholder : 'Enter your password',
        componentType : 'input',
        type : 'password',

    },
    {
        name: 'address',
        label : 'Address',
        placeholder : 'Enter your address',
        componentType : 'input',
        type : 'text',

    },

]

export const loginFormControls = [
    
    {
        name: 'email',
        label : 'Email',
        placeholder : 'Enter your email',
        componentType : 'input',
        type : 'email',

    },
    {
        name: 'password',
        label : 'Password',
        placeholder : 'Enter your password',
        componentType : 'input',
        type : 'password',

    },

]

export const addProductFormElements = [
    {
      label: "Title",
      name: "title",
      componentType: "input",
      type: "text",
      placeholder: "Enter product title",
    },
    {
      label: "Description",
      name: "description",
      componentType: "textarea",
      placeholder: "Enter product description",
    },
    {
      label: "Category",
      name: "category",
      componentType: "select",
      options: [
        { id: "protein", label: "Protein" },
        { id: "preworkout", label: "Pre-Workout" },
        { id: "postworkout", label: "Post-Workout" },
        { id: "creatine", label: "Creatine" },
        { id: "vitamins", label: "Vitamins" },
        { id: "weightgainer", label: "Weight Gainer" },
        { id: "fatburner", label: "Fat Burner" },
      ],
    },
    {
      label: "Brand",
      name: "brand",
      componentType: "select",
      options: [
        { id: "optimumnutrition", label: "Optimum Nutrition" },
        { id: "muscletech", label: "MuscleTech" },
        { id: "dymatize", label: "Dymatize" },
        { id: "bsn", label: "BSN" },
        { id: "ultimatenutrition", label: "Ultimate Nutrition" },
        { id: "myprotein", label: "MyProtein" },
        { id: "muscleblaze", label: "MuscleBlaze" },
        { id: "bigmuscles", label: "Bigmuscles Nutrition" },
        { id: "nutrabey", label: "Nutrabey" },
        { id: "beastlife", label: "Beast Life" },
        { id: "scitron", label: "Scitron" },

      ],
    },
    {
      label: "Price",
      name: "price",
      componentType: "input",
      type: "decimal",
      placeholder: "Enter product price",
    },
    {
      label: "Sale Price",
      name: "salePrice",
      componentType: "input",
      type: "decimal",
      placeholder: "Enter sale price (optional)",
    },
    {
      label: "Total Stock",
      name: "totalStock",
      componentType: "input",
      type: "decimal",
      placeholder: "Enter total stock",
    },
    {
      label: 'Status',
      name: 'status',
      componentType: 'select',
      options: [
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' },
      ],
    }
  ];


  export const shoppingViewHeaderMenuItems = [
    {
      id: "home",
      label: "Home",
      path: "/shop/home",
    },
    {
      id: "products",
      label: "Products",
      path: "/shop/listing",
    },
    {
      id: "protein",
      label: "Protein",
      path: "/shop/listing",
    },
    {
      id: "preworkout",
      label: "Pre-Workout",
      path: "/shop/listing",
    },
    {
      id: "postworkout",
      label: "Post-Workout",
      path: "/shop/listing",
    },
    {
      id: "vitamins",
      label: "Vitamins",
      path: "/shop/listing",
    },
    // {
    //   id: "weight-gainer",
    //   label: "Weight Gainer",
    //   path: "/shop/listing",
    // },
    // {
    //   id: "fat-burner",
    //   label: "Fat Burner",
    //   path: "/shop/listing",
    // },
    {
      id: "search",
      label: "Search",
      path: "/shop/search",
    },
  ];
  
  export const filterOptions ={
    category: [
      { id: "protein", label: "Protein" },
      { id: "preworkout", label: "Pre-Workout" },
      { id: "postworkout", label: "Post-Workout" },
      { id: "creatine", label: "Creatine" },
      { id: "vitamins", label: "Vitamins" },
      { id: "weightgainer", label: "Weight Gainer" },
      { id: "fatburner", label: "Fat Burner" },
    ], 
    brand: [
      { id: "optimumnutrition", label: "Optimum Nutrition" },
      { id: "muscletech", label: "MuscleTech" },
      { id: "dymatize", label: "Dymatize" },
      { id: "bsn", label: "BSN" },
      { id: "ultimatenutrition", label: "Ultimate Nutrition" },
      { id: "myprotein", label: "MyProtein" },
      { id: "muscleblaze", label: "MuscleBlaze" },
      { id: "bigmuscles", label: "Bigmuscles Nutrition" },
      { id: "nutrabey", label: "Nutrabey" },
      { id: "beastlife", label: "Beast Life" },
      { id: "scitron", label: "Scitron" },
    ],
  }

  export const categoryOptionsMap = {
    protein: "Protein",
    preworkout: "Pre-Workout",
    postworkout: "Post-Workout",
    creatine : "Creatine",
    vitamins: "Vitamins",
    weightgainer: "Weight Gainer",
    fatburner: "Fat Burner",
  };
  
  export const brandOptionsMap = {
    optimumnutrition: "Optimum Nutrition",
    muscletech: "MuscleTech",
    dymatize: "Dymatize",
    bsn: "BSN",
    ultimatenutrition: "Ultimate Nutrition",
    myprotein: "MyProtein",
    muscleblaze : "MuscleBlaze",
    bigmuscles : "Bigmuscles Nutrition" ,
    nutrabey : "Nutrabey" ,
    beastlife: "Beast Life" ,
    scitron : "Scitron" ,
  };

  export const sortOptions = [
    { id: "price-lowtohigh", label: "Price: Low to High" },
    { id: "price-hightolow", label: "Price: High to Low" },
    { id: "title-atoz", label: "Title: A to Z" },
    { id: "title-ztoa", label: "Title: Z to A" },
  ];

  export const addressFormControls = [
    {
      label: "Address",
      name: "address",
      componentType: "input",
      type: "text",
      placeholder: "Enter your address",
    },
    {
      label: "City",
      name: "city",
      componentType: "input",
      type: "text",
      placeholder: "Enter your city",
    },
    {
      label: "Phone Number",
      name: "phoneNumber",
      componentType: "input",
      type: "text",
      placeholder: "Enter your phone number",
    },
    {
      label: "Notes",
      name: "notes",
      componentType: "textarea",
      placeholder: "Enter any additional notes",
    },
  ];


export const personalDetailsFormControls = [
  {
    name: 'userName',
    label: 'User Name',
    placeholder: 'Enter your user name',
    componentType: 'input',
    type: 'text',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    componentType: 'input',
    type: 'email',
    required: true,
    disabled: true 
  },
  {
    name: 'phoneNumber',
    label: 'Phone number',
    placeholder: 'Enter your phone number',
    componentType: 'input',
    type: 'text',
    required: true
  }
]

export const passwordChangeFormControls = [
  {
    name: 'currentPassword',
    label: 'Current Password',
    placeholder: 'Enter your current password',
    componentType: 'input',
    type: 'password',
    required: true
  },
  {
    name: 'newPassword',
    label: 'New Password',
    placeholder: 'Enter your new password',
    componentType: 'input',
    type: 'password',
    required: true
  },
  {
    name: 'confirmPassword',
    label: 'Confirm New Password',
    placeholder: 'Confirm your new password',
    componentType: 'input',
    type: 'password',
    required: true
  }
]

export const vendorDetailsFormControls = [
  {
    name: 'businessName',
    label: 'Business Name',
    type: 'text',
    placeholder: 'Enter business name',
    required: true
  },
  {
    name: 'ownerName',
    label: 'Owner Name',
    type: 'text',
    placeholder: 'Enter owner name',
    required: true
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email',
    required: true,
    disabled: true 
  },
  {
    name: 'phone',
    label: 'Phone',
    type: 'tel',
    placeholder: 'Enter phone number',
    required: true
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text',
    placeholder: 'Enter business address',
    required: true,
    componentType: 'textarea'
  }
]