from abc import ABC, abstractmethod
from typing import Dict, Any
import os

class BaseGovtAdapter(ABC):
    @abstractmethod
    def verify(self, identifier: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        pass

class MockGSTAdapter(BaseGovtAdapter):
    def verify(self, gstin: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        gstin_clean = (gstin or "").strip().upper()
        # Simulated responses based on GSTIN
        if "FAIL" in gstin_clean or "07BBBBB" in gstin_clean:
            return {
                "source": "SIMULATED_GST_API",
                "mode": "Simulated Verification Data",
                "verified": False,
                "status": "CANCELLED",
                "gstin": gstin_clean,
                "legal_name": "Apex Cyber Solutions Pvt Ltd",
                "trade_name": "Apex Cyber",
                "registration_date": "2019-04-12",
                "taxpayer_type": "Regular",
                "state_code": "07 (Delhi)",
                "address": "402, Cyber Tower, Nehru Place, New Delhi",
                "discrepancy_note": "GSTIN status is CANCELLED due to non-filing of returns."
            }
        elif "07CCCCC" in gstin_clean or "VANGUARD" in gstin_clean:
            return {
                "source": "SIMULATED_GST_API",
                "mode": "Simulated Verification Data",
                "verified": True,
                "status": "ACTIVE",
                "gstin": gstin_clean,
                "legal_name": "Vanguard Digital Infrastructure Ltd",
                "trade_name": "Vanguard Digital",
                "registration_date": "2018-09-20",
                "taxpayer_type": "Regular",
                "state_code": "07 (Delhi)",
                "address": "Plot 88, Okhla Phase III, New Delhi",
                "name_mismatch_warning": "Name in document 'Vanguard Digital Infra Ltd' slightly differs from GST legal name 'Vanguard Digital Infrastructure Ltd'."
            }
        else: # Default compliant
            return {
                "source": "SIMULATED_GST_API",
                "mode": "Simulated Verification Data",
                "verified": True,
                "status": "ACTIVE",
                "gstin": gstin_clean or "07AAAAA1234A1Z5",
                "legal_name": "TechEdge Systems Pvt Ltd",
                "trade_name": "TechEdge Solutions",
                "registration_date": "2015-06-10",
                "taxpayer_type": "Regular",
                "state_code": "07 (Delhi)",
                "address": "101, Tech Park, Electronics City, New Delhi"
            }

class MockUdyamAdapter(BaseGovtAdapter):
    def verify(self, udyam_number: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        udyam_clean = (udyam_number or "").strip().upper()
        if "FAIL" in udyam_clean or "INVALID" in udyam_clean:
            return {
                "source": "SIMULATED_UDYAM_API",
                "mode": "Simulated Verification Data",
                "verified": False,
                "status": "NOT_FOUND",
                "udyam_number": udyam_clean,
                "enterprise_name": "Unknown Entity",
                "enterprise_type": "N/A",
                "major_activity": "N/A"
            }
        elif "APEX" in udyam_clean or "003" in udyam_clean:
            return {
                "source": "SIMULATED_UDYAM_API",
                "mode": "Simulated Verification Data",
                "verified": True,
                "status": "ACTIVE",
                "udyam_number": udyam_clean,
                "enterprise_name": "Apex Cyber Solutions",
                "enterprise_type": "MICRO",
                "major_activity": "Services",
                "dic": "Delhi North",
                "date_of_commencement": "2020-01-15"
            }
        else:
            return {
                "source": "SIMULATED_UDYAM_API",
                "mode": "Simulated Verification Data",
                "verified": True,
                "status": "ACTIVE",
                "udyam_number": udyam_clean or "UDYAM-DL-01-0089412",
                "enterprise_name": "TechEdge Systems Pvt Ltd",
                "enterprise_type": "MEDIUM",
                "major_activity": "Manufacturing / IT Services",
                "dic": "Delhi South",
                "date_of_commencement": "2015-07-01"
            }

class MockPANAdapter(BaseGovtAdapter):
    def verify(self, pan: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        pan_clean = (pan or "").strip().upper()
        return {
            "source": "SIMULATED_INCOMETAX_API",
            "mode": "Simulated Verification Data",
            "verified": True,
            "pan": pan_clean or "AACCT1234K",
            "pan_status": "VALID_AND_OPERATIVE",
            "category": "Company",
            "aadhaar_linked": True,
            "itr_filing_status_last_3_years": ["FILED", "FILED", "FILED"]
        }

class MockDigiLockerAdapter(BaseGovtAdapter):
    def verify(self, doc_id: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        return {
            "source": "SIMULATED_DIGILOCKER_API",
            "mode": "Simulated Verification Data",
            "verified": True,
            "issuer": "Ministry of Corporate Affairs / MSME",
            "digital_signature_valid": True,
            "timestamp": "2026-08-15T10:30:00Z",
            "doc_type": extra_data.get("doc_type", "CERTIFICATE") if extra_data else "CERTIFICATE",
            "metadata_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        }

class MockMCAAdapter(BaseGovtAdapter):
    def verify(self, cin: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        cin_clean = (cin or "").strip().upper()
        return {
            "source": "SIMULATED_MCA_API",
            "mode": "Simulated Verification Data",
            "verified": True,
            "cin": cin_clean or "U72900DL2015PTC281234",
            "company_status": "ACTIVE",
            "company_class": "Private",
            "authorized_capital": 10000000.0,
            "paid_up_capital": 5000000.0,
            "date_of_incorporation": "2015-06-10"
        }

class MockBlacklistingAdapter(BaseGovtAdapter):
    def verify(self, identifier: str, extra_data: Dict[str, Any] = None) -> Dict[str, Any]:
        company_name = extra_data.get("company_name", "").upper() if extra_data else ""
        if "BLACK" in company_name or "APEX" in company_name:
            return {
                "source": "SIMULATED_GEM_CPPP_BLACKLIST",
                "mode": "Simulated Verification Data",
                "is_blacklisted": True,
                "reason": "Debarred by CPPP due to non-delivery of items in Tender GEM/2024/B/5512.",
                "blacklisted_until": "2027-12-31",
                "authority": "Central Public Procurement Portal"
            }
        return {
            "source": "SIMULATED_GEM_CPPP_BLACKLIST",
            "mode": "Simulated Verification Data",
            "is_blacklisted": False,
            "reason": "Clean procurement record. No active debarment or penalty flags.",
            "blacklisted_until": None,
            "authority": "GeM Debarment Database"
        }

class GovtAdapterFactory:
    @staticmethod
    def get_adapter(service_name: str) -> BaseGovtAdapter:
        mode = os.getenv("GOVT_VERIFICATION_MODE", "simulated").lower()
        # Even in live/sandbox mode, we provide clear mock structure for prototype
        if service_name.lower() == "gst":
            return MockGSTAdapter()
        elif service_name.lower() == "udyam":
            return MockUdyamAdapter()
        elif service_name.lower() == "pan":
            return MockPANAdapter()
        elif service_name.lower() == "digilocker":
            return MockDigiLockerAdapter()
        elif service_name.lower() == "mca":
            return MockMCAAdapter()
        elif service_name.lower() in ["blacklisting", "debarment"]:
            return MockBlacklistingAdapter()
        else:
            raise ValueError(f"Unknown verification service: {service_name}")
