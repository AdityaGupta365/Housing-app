






import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib

def generate_housing_data():
    np.random.seed(42)
    n_samples = 5000
    
    data = {
        'area_sqft': np.random.normal(1200, 400, n_samples),
        'bedrooms': np.random.choice([1, 2, 3, 4, 5], n_samples, p=[0.2, 0.3, 0.25, 0.15, 0.1]),
        'bathrooms': np.random.choice([1, 2, 3, 4], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
        'location': np.random.choice(['Downtown', 'Suburb', 'City Center', 'Outskirts'], n_samples),
        'property_type': np.random.choice(['Apartment', 'House', 'Condo', 'Studio'], n_samples),
        'age_years': np.random.randint(0, 50, n_samples),
        'parking_spots': np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1]),
        'furnished': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
        'amenities_count': np.random.randint(0, 10, n_samples),
        'distance_to_center_km': np.random.exponential(5, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Base price calculation with bedroom-focused pricing
    base_price = np.zeros(n_samples)
    
    # Set base prices primarily based on bedrooms (BHK)
    for i in range(n_samples):
        bedrooms = df.loc[i, 'bedrooms']
        
        if bedrooms == 1:  # 1 BHK
            base_price[i] = 15000 + np.random.normal(0, 2000)
        elif bedrooms == 2:  # 2 BHK
            base_price[i] = 20000 + np.random.normal(0, 2500)
        elif bedrooms == 3:  # 3 BHK
            base_price[i] = 25000 + np.random.normal(0, 3000)
        elif bedrooms == 4:  # 4 BHK
            base_price[i] = 32000 + np.random.normal(0, 4000)
        else:  # 5 BHK
            base_price[i] = 40000 + np.random.normal(0, 5000)
    
    # Additional factors that modify the base price
    area_factor = (df['area_sqft'] - 1000) * 2  # Small area adjustment
    bathroom_factor = df['bathrooms'] * 1000
    parking_factor = df['parking_spots'] * 800
    furnished_factor = df['furnished'] * 2000
    amenities_factor = df['amenities_count'] * 300
    age_penalty = df['age_years'] * 100
    distance_penalty = df['distance_to_center_km'] * 200
    
    # Apply adjustments
    adjusted_price = (base_price + 
                     area_factor + 
                     bathroom_factor + 
                     parking_factor + 
                     furnished_factor + 
                     amenities_factor - 
                     age_penalty - 
                     distance_penalty)
    
    # Location multipliers
    location_multipliers = {
        'Downtown': 1.3, 'City Center': 1.2,
        'Suburb': 1.0, 'Outskirts': 0.85
    }
    
    df['location_multiplier'] = df['location'].map(location_multipliers)
    
    # Property type multipliers
    type_multipliers = {
        'House': 1.15, 'Condo': 1.1,
        'Apartment': 1.0, 'Studio': 0.8
    }
    df['type_multiplier'] = df['property_type'].map(type_multipliers)
    
    # Final price calculation
    df['rent_price'] = (adjusted_price * df['location_multiplier'] * df['type_multiplier']).clip(8000)
    
    # Clean up
    df = df.drop(['location_multiplier', 'type_multiplier'], axis=1)
    df = df[(df['area_sqft'] > 300) & (df['area_sqft'] < 3000)]
    
    return df

def train_model():
    # Generate and prepare data
    df = generate_housing_data()
    
    # Print some statistics to verify pricing
    print("Average rent prices by bedroom count:")
    for bhk in sorted(df['bedrooms'].unique()):
        avg_price = df[df['bedrooms'] == bhk]['rent_price'].mean()
        print(f"{bhk} BHK: ₹{avg_price:,.0f}")
    
    # Encode categorical variables
    le_location = LabelEncoder()
    le_property_type = LabelEncoder()
    
    df['location_encoded'] = le_location.fit_transform(df['location'])
    df['property_type_encoded'] = le_property_type.fit_transform(df['property_type'])
    
    # Features and target
    feature_columns = [
        'area_sqft', 'bedrooms', 'bathrooms', 'location_encoded',
        'property_type_encoded', 'age_years', 'parking_spots',
        'furnished', 'amenities_count', 'distance_to_center_km'
    ]
    
    X = df[feature_columns]
    y = df['rent_price']
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=15)
    model.fit(X_train, y_train)
    
    # Save model and encoders
    joblib.dump(model, 'rent_prediction_model.pkl')
    joblib.dump(le_location, 'location_encoder.pkl')
    joblib.dump(le_property_type, 'property_type_encoder.pkl')
    
    # Model performance
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    
    print(f"\nModel trained successfully!")
    print(f"Training R² Score: {train_score:.3f}")
    print(f"Testing R² Score: {test_score:.3f}")
    
    return model, le_location, le_property_type


if __name__ == "__main__":
   train_model()