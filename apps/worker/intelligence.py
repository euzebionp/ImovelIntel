class IntelligenceService:
    @staticmethod
    def calculate_health_score(geo_data: dict, bureau_data: dict) -> dict:
        score = 100
        penalties = []
        
        # Check Address Precision
        if geo_data.get('type') != 'house' and geo_data.get('type') != 'residential':
            score -= 10
            penalties.append("Endereço não classificado como residencial específico")
            
        # Check Owner Info
        owner_data = bureau_data.get('owner', {})
        if owner_data.get('status') != 'Regular':
            score -= 30
            penalties.append(f"Status do Proprietário: {owner_data.get('status')}")
            
        # Mock Debt Check
        import random
        has_debt = random.choice([True, False, False]) # 33% chance of debt
        if has_debt:
            score -= 40
            penalties.append("Constam débitos de IPTU/Condomínio")
            
        return {
            "score": max(0, score),
            "classification": "A+" if score >= 90 else "B" if score >= 70 else "C",
            "penalties": penalties,
            "has_debts": has_debt
        }
