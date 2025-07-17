from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained model and encoders
try:
    model = joblib.load('rent_prediction_model.pkl')
    location_encoder = joblib.load('location_encoder.pkl')
    property_type_encoder = joblib.load('property_type_encoder.pkl')
    print("Model loaded successfully!")
except:
    print("Training model first...")
    from data.housing_data import train_model
    model, location_encoder, property_type_encoder = train_model()

@app.route('/predict', methods=['POST'])
def predict_rent():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = [
            'area_sqft', 'bedrooms', 'bathrooms', 'location', 
            'property_type', 'age_years', 'parking_spots', 
            'furnished', 'amenities_count', 'distance_to_center_km'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400
        
        # Encode categorical variables
        try:
            location_encoded = location_encoder.transform([data['location']])[0]
        except:
            return jsonify({'error': 'Invalid location'}), 400
            
        try:
            property_type_encoded = property_type_encoder.transform([data['property_type']])[0]
        except:
            return jsonify({'error': 'Invalid property type'}), 400
        
        # Prepare features
        features = np.array([[
            data['area_sqft'],
            data['bedrooms'],
            data['bathrooms'],
            location_encoded,
            property_type_encoded,
            data['age_years'],
            data['parking_spots'],
            int(data['furnished']),
            data['amenities_count'],
            data['distance_to_center_km']
        ]])
        
        # Make prediction
        prediction = model.predict(features)[0]
        
        # Get confidence interval (using standard deviation of predictions)
        predictions_ensemble = []
        for estimator in model.estimators_[:10]:  # Use first 10 trees
            pred = estimator.predict(features)[0]
            predictions_ensemble.append(pred)
        
        std_dev = np.std(predictions_ensemble)
        confidence_lower = max(0, prediction - 1.96 * std_dev)
        confidence_upper = prediction + 1.96 * std_dev
        
        # Market insights
        market_insights = generate_market_insights(data, prediction)
        
        return jsonify({
            'predicted_rent': round(prediction, 2),
            'confidence_interval': {
                'lower': round(confidence_lower, 2),
                'upper': round(confidence_upper, 2)
            },
            'market_insights': market_insights,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

def generate_market_insights(property_data, predicted_rent):
    insights = []
    
    # Area insights
    if property_data['area_sqft'] > 1500:
        insights.append("Large property - premium pricing expected")
    elif property_data['area_sqft'] < 800:
        insights.append("Compact property - budget-friendly option")
    
    # Location insights
    if property_data['location'] in ['Downtown', 'City Center']:
        insights.append("Prime location commands higher rent")
    
    # Age insights
    if property_data['age_years'] < 5:
        insights.append("New property - modern amenities justify higher rent")
    elif property_data['age_years'] > 20:
        insights.append("Older property - consider renovation to increase value")
    
    # Amenities insights
    if property_data['amenities_count'] > 7:
        insights.append("High amenities count adds significant value")
    
    return insights

@app.route('/market-analysis', methods=['POST'])
def market_analysis():
    try:
        data = request.json
        location = data.get('location', 'Downtown')
        property_type = data.get('property_type', 'Apartment')
        
        # Generate market comparison data
        comparison_data = []
        
        # Similar properties analysis
        for bedrooms in [1, 2, 3, 4]:
            for area in [800, 1200, 1600]:
                sample_data = {
                    'area_sqft': area,
                    'bedrooms': bedrooms,
                    'bathrooms': min(bedrooms, 3),
                    'location': location,
                    'property_type': property_type,
                    'age_years': 5,
                    'parking_spots': 1,
                    'furnished': True,
                    'amenities_count': 5,
                    'distance_to_center_km': 3
                }
                
                # Get prediction for this configuration
                location_encoded = location_encoder.transform([location])[0]
                property_type_encoded = property_type_encoder.transform([property_type])[0]
                
                features = np.array([[
                    area, bedrooms, min(bedrooms, 3), location_encoded,
                    property_type_encoded, 5, 1, 1, 5, 3
                ]])
                
                predicted_rent = model.predict(features)[0]
                
                comparison_data.append({
                    'bedrooms': bedrooms,
                    'area_sqft': area,
                    'predicted_rent': round(predicted_rent, 2)
                })
        
        return jsonify({
            'market_comparison': comparison_data,
            'success': True
        })
        
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'model_loaded': True})

if __name__ == '__main__':
    app.run(debug=True, port=5001)