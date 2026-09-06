import { Tender, Bidder, AuditEvent, PublicTenderSummary, Discrepancy } from '../types';

export const MOCK_TENDERS: Tender[] = [
  {
    id: 1,
    tender_id: 'GEM/2026/B/894120',
    title: 'Procurement of High-Performance Rack Servers & AI Accelerators for NIC Data Center',
    department: 'Ministry of Electronics & Information Technology (MeitY)',
    category: 'IT Hardware & Compute Infrastructure',
    estimated_value: 12.5, // Crores
    publish_date: '2026-08-01',
    closing_date: '2026-09-30',
    status: 'ACTIVE',
    pdf_filename: 'GeM_Tender_Specification_GEM_894120.pdf',
    description: 'Supply, installation, commissioning, and 3-year OEM warranty for AI compute nodes, GPU server clusters, and rack storage arrays.',
    bidders_count: 4,
    created_at: '2026-08-01T10:00:00Z',
    requirements: [
      {
        id: 101,
        code: 'REQ_GST',
        title: 'GST Registration & Active Return Filing',
        category: 'Statutory',
        rule_type: 'MATCH',
        operator: '==',
        threshold: 'ACTIVE',
        unit: 'taxpayer_status',
        is_mandatory: true,
        description: 'Bidder must possess a valid GSTIN registered in India with ACTIVE tax return filing status.'
      },
      {
        id: 102,
        code: 'REQ_PAN',
        title: 'PAN Card & Income Tax Compliance',
        category: 'Statutory',
        rule_type: 'EXISTS',
        operator: '==',
        threshold: 'VALID_OPERATIVE',
        unit: 'pan_status',
        is_mandatory: true,
        description: 'Bidder must submit Permanent Account Number (PAN) and past 3 financial years ITR acknowledgements.'
      },
      {
        id: 103,
        code: 'REQ_UDYAM',
        title: 'Udyam / MSME Registration Verification',
        category: 'Statutory',
        rule_type: 'EXISTS',
        operator: '==',
        threshold: 'VERIFIED',
        unit: 'udyam_status',
        is_mandatory: true,
        description: 'Valid Udyam registration required for EMD exemption eligibility under MSME procurement policy.'
      },
      {
        id: 104,
        code: 'REQ_OEM_AUTH',
        title: 'Valid OEM Authorization Form (MAF)',
        category: 'Technical',
        rule_type: 'DATE_VALID',
        operator: '>=',
        threshold: '2026-09-30',
        unit: 'closing_date',
        is_mandatory: true,
        description: 'Bidder must submit original Manufacturer Authorization Form (MAF) valid through tender closing date.'
      },
      {
        id: 105,
        code: 'REQ_LOCAL_CONTENT',
        title: 'Make in India Local Content Percentage',
        category: 'Technical',
        rule_type: 'NUMERIC_GE',
        operator: '>=',
        threshold: 50.0,
        unit: 'percentage',
        is_mandatory: true,
        description: 'Class-I Local Supplier eligibility (Minimum 50% Local Content percentage declaration required).'
      },
      {
        id: 106,
        code: 'REQ_TURNOVER',
        title: 'Minimum Financial Turnover (3-Yr Avg)',
        category: 'Financial',
        rule_type: 'NUMERIC_GE',
        operator: '>=',
        threshold: 5.0,
        unit: 'inr_crores',
        is_mandatory: true,
        description: 'Average annual financial turnover during the last 3 financial years must be >= ₹5.0 Crores.'
      },
      {
        id: 107,
        code: 'REQ_NO_BLACKLIST',
        title: 'Non-Blacklisting & Debarment Declaration',
        category: 'Mandatory',
        rule_type: 'MATCH',
        operator: '==',
        threshold: 'CLEAN_RECORD',
        unit: 'debarment_status',
        is_mandatory: true,
        description: 'Bidder must not be debarred or blacklisted by CPPP, GeM portal, or any Central Ministry.'
      }
    ]
  }
];

export const MOCK_BIDDERS: Bidder[] = [
  {
    id: 1,
    bidder_code: 'BID-2026-001',
    company_name: 'Bharat Technologies Pvt Ltd',
    pan: 'AACCB1234K',
    gstin: '07AACCB1234K1Z5',
    udyam_number: 'UDYAM-DL-01-0089412',
    cin: 'U72900DL2015PTC281234',
    email: 'tenders@bharattech.co.in',
    phone: '+91-11-26894000',
    registered_address: '101, Tech Park, Electronics City, Okhla Phase I, New Delhi - 110020',
    bidder_type: 'Private Limited',
    is_startup: false,
    is_msme: true,
    declared_turnover: 18.5,
    declared_local_content: 65.0,
    created_at: '2026-08-10T09:30:00Z',
    compliance_score: 96.0,
    risk_level: 'LOW',
    trust_rating: 'VERIFIED_LEGITIMATE',
    ai_recommendation: 'RECOMMEND QUALIFICATION: Bidder satisfies all statutory, technical, financial, and session telemetry criteria with high confidence. All documents cross-verified with Govt portals.',
    recommendation_reasons: [
      'GSTIN active with verified 36-month clean return filing track record on GSTN.',
      'Udyam Medium Enterprise registration confirmed on MSME portal.',
      'Make in India local content (65%) comfortably exceeds tender threshold (50%).',
      'Human session telemetry indicates natural mouse movements and typing cadence.'
    ],
    officer_decision: 'QUALIFIED',
    officer_notes: 'Approved based on 100% verified evidence and clear debarment checks.',
    documents: [
      {
        id: 1001,
        bidder_id: 1,
        document_type: 'GST_CERT',
        document_name: 'GST Registration Certificate',
        filename: 'GST_Cert_BharatTech.pdf',
        file_size: 420000,
        upload_date: '2026-08-10T09:35:00Z',
        status: 'VERIFIED',
        page_count: 2,
        raw_text: 'Government of India - Form GST REG-06. GSTIN: 07AACCB1234K1Z5. Legal Name: Bharat Technologies Pvt Ltd. Status: ACTIVE.',
        extracted_fields: [
          { field_name: 'gstin', field_value: '07AACCB1234K1Z5', confidence: 0.99, page_number: 1 },
          { field_name: 'legal_name', field_value: 'Bharat Technologies Pvt Ltd', confidence: 0.98, page_number: 1 },
          { field_name: 'status', field_value: 'ACTIVE', confidence: 0.99, page_number: 2 }
        ]
      },
      {
        id: 1002,
        bidder_id: 1,
        document_type: 'PAN_CARD',
        document_name: 'Permanent Account Number Card',
        filename: 'PAN_Card_BharatTech.pdf',
        file_size: 210000,
        upload_date: '2026-08-10T09:36:00Z',
        status: 'VERIFIED',
        page_count: 1,
        raw_text: 'Income Tax Department - PAN Card. PAN: AACCB1234K. Name: Bharat Technologies Pvt Ltd.',
        extracted_fields: [
          { field_name: 'pan', field_value: 'AACCB1234K', confidence: 0.99, page_number: 1 },
          { field_name: 'entity_name', field_value: 'Bharat Technologies Pvt Ltd', confidence: 0.97, page_number: 1 }
        ]
      },
      {
        id: 1003,
        bidder_id: 1,
        document_type: 'UDYAM_CERT',
        document_name: 'Udyam Registration Certificate',
        filename: 'Udyam_Registration_BharatTech.pdf',
        file_size: 380000,
        upload_date: '2026-08-10T09:37:00Z',
        status: 'VERIFIED',
        page_count: 2,
        raw_text: 'Ministry of MSME - Udyam Registration. Number: UDYAM-DL-01-0089412. Enterprise Type: MEDIUM.',
        extracted_fields: [
          { field_name: 'udyam_number', field_value: 'UDYAM-DL-01-0089412', confidence: 0.99, page_number: 1 },
          { field_name: 'enterprise_type', field_value: 'MEDIUM', confidence: 0.96, page_number: 1 }
        ]
      },
      {
        id: 1004,
        bidder_id: 1,
        document_type: 'OEM_AUTH',
        document_name: 'OEM Manufacturer Authorization Form (MAF)',
        filename: 'OEM_MAF_Intel_BharatTech.pdf',
        file_size: 310000,
        upload_date: '2026-08-10T09:38:00Z',
        status: 'VERIFIED',
        page_count: 1,
        expiry_date: '2027-12-31',
        raw_text: 'Intel Corporation MAF. Authorizes Bharat Technologies Pvt Ltd. Valid through: 2027-12-31.',
        extracted_fields: [
          { field_name: 'oem_name', field_value: 'Intel Corporation', confidence: 0.98, page_number: 1 },
          { field_name: 'authorization_expiry', field_value: '2027-12-31', confidence: 0.95, page_number: 1 }
        ]
      },
      {
        id: 1005,
        bidder_id: 1,
        document_type: 'MAKE_IN_INDIA_DECL',
        document_name: 'Class-I Local Content Declaration',
        filename: 'Make_In_India_Declaration.pdf',
        file_size: 190000,
        upload_date: '2026-08-10T09:39:00Z',
        status: 'VERIFIED',
        page_count: 1,
        raw_text: 'Class-I Local Supplier Self-Declaration under Public Procurement Order. Local content: 65.0%.',
        extracted_fields: [
          { field_name: 'local_content_percentage', field_value: '65.0%', confidence: 0.99, page_number: 1 }
        ]
      },
      {
        id: 1006,
        bidder_id: 1,
        document_type: 'TURNOVER_CERT',
        document_name: 'CA Audited Turnover Certificate',
        filename: 'Turnover_Certificate_CA.pdf',
        file_size: 280000,
        upload_date: '2026-08-10T09:40:00Z',
        status: 'VERIFIED',
        page_count: 2,
        raw_text: 'Chartered Accountant Certificate. Average 3-year turnover: INR 18.5 Crores.',
        extracted_fields: [
          { field_name: 'declared_turnover', field_value: '18.5 Crores', confidence: 0.97, page_number: 1 }
        ]
      }
    ],
    verification_layers: [
      {
        id: 'LAYER_MCA',
        title: 'Business & Incorporation Verification (MCA21)',
        category: 'MCA21 Registry',
        status: 'PASSED',
        extracted_value: 'CIN: U72900DL2015PTC281234',
        expected_rule: 'Active Company Status on MCA21',
        govt_source_value: 'ACTIVE (Inc. 10-Jun-2015)',
        source_document: 'GST_Cert_BharatTech.pdf',
        page_number: 1,
        confidence: 0.99,
        rationale: 'Company CIN verified on MCA21 portal. Paid-up capital ₹50 Lakhs. No insolvency or liquidation proceedings.'
      },
      {
        id: 'LAYER_GST',
        title: 'GST Registration & Return Filing Compliance',
        category: 'GSTN Portal',
        status: 'PASSED',
        extracted_value: 'GSTIN: 07AACCB1234K1Z5',
        expected_rule: 'ACTIVE Taxpayer with Regular Returns',
        govt_source_value: 'ACTIVE (GSTR-3B filed up to July 2026)',
        source_document: 'GST_Cert_BharatTech.pdf',
        page_number: 1,
        confidence: 0.99,
        rationale: 'GSTIN verified on GSTN database. Legal entity name matches exactly. Tax return compliance score 100%.'
      },
      {
        id: 'LAYER_PAN',
        title: 'PAN Card & Income Tax Verification',
        category: 'Income Tax Dept',
        status: 'PASSED',
        extracted_value: 'PAN: AACCB1234K',
        expected_rule: 'Operative PAN with 3-Yr ITR Filing',
        govt_source_value: 'VALID_AND_OPERATIVE (ITR AY 2024-26 Filed)',
        source_document: 'PAN_Card_BharatTech.pdf',
        page_number: 1,
        confidence: 0.98,
        rationale: 'PAN is valid, linked with Aadhaar directors, and verified against CBDT database.'
      },
      {
        id: 'LAYER_UDYAM',
        title: 'Udyam / MSME Registration Verification',
        category: 'Ministry of MSME',
        status: 'PASSED',
        extracted_value: 'UDYAM-DL-01-0089412',
        expected_rule: 'Active Udyam Certificate',
        govt_source_value: 'ACTIVE (Medium Enterprise - Mfg/Services)',
        source_document: 'Udyam_Registration_BharatTech.pdf',
        page_number: 1,
        confidence: 0.99,
        rationale: 'Udyam registration verified on MSME portal. Entitled to EMD exemption privileges.'
      },
      {
        id: 'LAYER_STARTUP',
        title: 'Startup India / DPIIT Status',
        category: 'DPIIT Portal',
        status: 'PASSED',
        extracted_value: 'DPIIT Recognized',
        expected_rule: 'Optional Privilege Verification',
        govt_source_value: 'DPIIT78412 (Valid)',
        source_document: 'Udyam_Registration_BharatTech.pdf',
        page_number: 1,
        confidence: 0.95,
        rationale: 'Recognized Startup status verified.'
      },
      {
        id: 'LAYER_EPFO',
        title: 'EPFO & ESIC Employee Statutory Compliance',
        category: 'EPFO / ESIC Database',
        status: 'PASSED',
        extracted_value: 'EPF Est. ID: DLCPM004812',
        expected_rule: 'Regular EPF/ESIC Monthly ECR Filing',
        govt_source_value: 'COMPLIANT (142 Active Employees)',
        source_document: 'GST_Cert_BharatTech.pdf',
        page_number: 2,
        confidence: 0.96,
        rationale: 'EPFO portal confirms active monthly ECR filings for 142 registered employees.'
      },
      {
        id: 'LAYER_BLACKLIST',
        title: 'Blacklisting & Debarment Verification',
        category: 'CPPP & GeM Debarment',
        status: 'PASSED',
        extracted_value: 'Self-Declaration Submitted',
        expected_rule: 'No Active Debarment Record',
        govt_source_value: 'CLEAN_RECORD (0 Penalties)',
        source_document: 'Make_In_India_Declaration.pdf',
        page_number: 1,
        confidence: 0.98,
        rationale: 'No blacklisting or debarment records found across GeM, CPPP, or Ministry databases.'
      },
      {
        id: 'LAYER_ELIGIBILITY',
        title: 'Tender Eligibility (Turnover, OEM MAF & Local Content)',
        category: 'Tender Criteria',
        status: 'PASSED',
        extracted_value: 'Turnover ₹18.5 Cr | MAF 2027 | MII 65%',
        expected_rule: 'Turnover >= ₹5 Cr | MAF Valid | MII >= 50%',
        govt_source_value: 'ALL CRITERIA SATISFIED',
        source_document: 'OEM_MAF_Intel_BharatTech.pdf',
        page_number: 1,
        confidence: 0.97,
        rationale: 'All tender-specific financial and technical criteria satisfied.'
      },
      {
        id: 'LAYER_FINANCIAL_RISK',
        title: 'Permitted Financial / Regulatory Risk Indicators',
        category: 'Public RBI & MCA Data',
        status: 'PASSED',
        extracted_value: 'Public Credit Rating: AA',
        expected_rule: 'No Public Debts/Defaults',
        govt_source_value: 'LOW FINANCIAL RISK',
        source_document: 'Turnover_Certificate_CA.pdf',
        page_number: 1,
        confidence: 0.94,
        rationale: 'Permitted public financial indicators show sound liquidity and no public default flags.'
      },
      {
        id: 'LAYER_CONSISTENCY',
        title: '3-Way Document & Registry Consistency',
        category: 'Cross-Verification',
        status: 'PASSED',
        extracted_value: 'Exact Name & Address Match',
        expected_rule: 'Zero Mismatch across Documents',
        govt_source_value: '100% CONSISTENT',
        source_document: 'GST_Cert_BharatTech.pdf',
        page_number: 1,
        confidence: 0.99,
        rationale: 'Company name, PAN, GSTIN, and registered address are 100% consistent across all uploaded documents and Government portals.'
      },
      {
        id: 'LAYER_TELEMETRY',
        title: 'Bid-Session Intelligence & Telemetry Anomaly Check',
        category: 'Session Intelligence',
        status: 'PASSED',
        extracted_value: 'Human Session Cadence (2.5 mins)',
        expected_rule: 'Normal Human Interaction Patterns',
        govt_source_value: 'HUMAN INTERACTION SIGNAL',
        source_document: 'Telemetry_Logger',
        page_number: 1,
        confidence: 0.95,
        rationale: 'Typing speed (48 WPM), mouse movement entropy, and decision pauses confirm human interaction.'
      }
    ],
    telemetry: {
      typing_speed_wpm: 48,
      typing_cadence_std_dev_ms: 112,
      mouse_movement_entropy: 0.88,
      mouse_speed_pixels_per_sec: 420,
      click_interval_regularity: 0.24, // low regularity = human
      time_spent_reviewing_sec: 155,
      session_platform: 'Web',
      device_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
      automation_risk: 'NORMAL',
      automation_score: 12,
      rationale: 'Natural human navigation telemetry. Variable keystroke timings and human review pauses detected.'
    },
    replay_timeline: [
      { id: 'ev-1', timestamp: '10:21:03', time_offset_sec: 0, event_type: 'LOGIN', title: 'Bidder Authentication', details: 'Bidder logged in via GeM 2FA OTP authentication.', status: 'GREEN', ip_masked: '103.24.xxx.42', platform: 'Web Browser' },
      { id: 'ev-2', timestamp: '10:21:20', time_offset_sec: 17, event_type: 'TENDER_OPEN', title: 'Tender Opened', details: 'Opened Tender GEM/2026/B/894120 specification checklist.', status: 'GREEN', ip_masked: '103.24.xxx.42', platform: 'Web Browser' },
      { id: 'ev-3', timestamp: '10:22:10', time_offset_sec: 67, event_type: 'DOC_VERIFIED', title: 'Document Vault Upload & OCR', details: 'Uploaded 6 statutory certificates; AI OCR verified fields in real-time.', status: 'GREEN', ip_masked: '103.24.xxx.42', platform: 'Web Browser' },
      { id: 'ev-4', timestamp: '10:23:02', time_offset_sec: 119, event_type: 'BID_ENTRY', title: 'Commercial Bid Entry', details: 'Entered itemized financial quote: ₹ 11,85,00,000.', status: 'GREEN', ip_masked: '103.24.xxx.42', platform: 'Web Browser' },
      { id: 'ev-5', timestamp: '10:23:18', time_offset_sec: 135, event_type: 'VALIDATION', title: 'System Validation Completed', details: 'Passed automated rule validation checks.', status: 'GREEN', ip_masked: '103.24.xxx.42', platform: 'Web Browser' },
      { id: 'ev-6', timestamp: '10:23:25', time_offset_sec: 142, event_type: 'SUBMISSION', title: 'Final Bid Submission', details: 'Digitally signed and submitted bid package.', status: 'GREEN', ip_masked: '103.24.xxx.42', platform: 'Web Browser' }
    ]
  },
  {
    id: 2,
    bidder_code: 'BID-2026-002',
    company_name: 'Nova Systems & Infra Ltd',
    pan: 'AABCN5678L',
    gstin: '07AABCN5678L1Z3',
    udyam_number: 'UDYAM-DL-02-0054321',
    cin: 'U74999DL2018PLC339876',
    email: 'tenders@novasystems.in',
    phone: '+91-11-45678900',
    registered_address: 'Plot 88, Okhla Industrial Area Phase III, New Delhi - 110020',
    bidder_type: 'Public Limited',
    is_startup: false,
    is_msme: false,
    declared_turnover: 8.2,
    declared_local_content: 45.0, // Below 50%
    created_at: '2026-08-11T11:00:00Z',
    compliance_score: 78.0,
    risk_level: 'MEDIUM',
    trust_rating: 'NEEDS_OFFICER_REVIEW',
    ai_recommendation: 'FURTHER REVIEW REQUIRED: OEM Authorization MAF document missing from bid package. Local content declaration (45%) falls below Class-I 50% threshold.',
    recommendation_reasons: [
      'OEM Authorization MAF form missing from uploaded bid documents.',
      'Declared local content (45%) is Class-II; tender specifies Class-I Local Supplier requirement (>= 50%).',
      'Slight legal name discrepancy: GST legal name is "Nova Systems Infrastructure Ltd" vs declared "Nova Systems & Infra Ltd".'
    ],
    officer_decision: 'UNDER_REVIEW',
    officer_notes: 'Requested clarification regarding missing OEM MAF form and Local Content certificate.',
    documents: [
      {
        id: 2001,
        bidder_id: 2,
        document_type: 'GST_CERT',
        document_name: 'GST Registration Certificate',
        filename: 'GST_Cert_NovaSystems.pdf',
        file_size: 410000,
        upload_date: '2026-08-11T11:05:00Z',
        status: 'VERIFIED',
        page_count: 2,
        raw_text: 'GSTIN: 07AABCN5678L1Z3. Legal Name: Nova Systems Infrastructure Ltd. Status: ACTIVE.',
        extracted_fields: [
          { field_name: 'gstin', field_value: '07AABCN5678L1Z3', confidence: 0.99, page_number: 1 },
          { field_name: 'legal_name', field_value: 'Nova Systems Infrastructure Ltd', confidence: 0.97, page_number: 1 }
        ]
      },
      {
        id: 2002,
        bidder_id: 2,
        document_type: 'OEM_AUTH',
        document_name: 'OEM MAF Authorization',
        filename: 'OEM_Authorization_Nova.pdf',
        file_size: 0,
        upload_date: '2026-08-11T11:06:00Z',
        status: 'MISSING',
        page_count: 0,
        raw_text: '',
        extracted_fields: []
      },
      {
        id: 2003,
        bidder_id: 2,
        document_type: 'MAKE_IN_INDIA_DECL',
        document_name: 'Class-II Local Content Declaration',
        filename: 'MII_Declaration_Nova.pdf',
        file_size: 180000,
        upload_date: '2026-08-11T11:07:00Z',
        status: 'DISCREPANCY',
        page_count: 1,
        raw_text: 'Class-II Local Content Declaration. Declared Local Content: 45.0%.',
        extracted_fields: [
          { field_name: 'local_content_percentage', field_value: '45.0%', confidence: 0.99, page_number: 1 }
        ]
      }
    ],
    verification_layers: [
      {
        id: 'LAYER_MCA',
        title: 'Business & Incorporation Verification (MCA21)',
        category: 'MCA21 Registry',
        status: 'PASSED',
        extracted_value: 'CIN: U74999DL2018PLC339876',
        expected_rule: 'Active Status on MCA21',
        govt_source_value: 'ACTIVE (Inc. 20-Sep-2018)',
        source_document: 'GST_Cert_NovaSystems.pdf',
        page_number: 1,
        confidence: 0.98,
        rationale: 'Active company record on MCA21 registry.'
      },
      {
        id: 'LAYER_GST',
        title: 'GST Registration & Return Filing Compliance',
        category: 'GSTN Portal',
        status: 'WARNING',
        extracted_value: 'Legal Name: Nova Systems Infrastructure Ltd',
        expected_rule: 'Exact Name Match with Bidder Profile',
        govt_source_value: 'ACTIVE (Slight Name Variation)',
        source_document: 'GST_Cert_NovaSystems.pdf',
        page_number: 1,
        confidence: 0.95,
        rationale: 'GST status ACTIVE, but legal name on GST portal ("Nova Systems Infrastructure Ltd") contains minor word variation from declared name.'
      },
      {
        id: 'LAYER_OEM',
        title: 'Valid OEM Authorization Form (MAF)',
        category: 'Technical Eligibility',
        status: 'MISSING',
        extracted_value: 'NOT SUBMITTED',
        expected_rule: 'MAF Form Valid till 2026-09-30',
        govt_source_value: 'UNVERIFIED',
        source_document: 'OEM_Authorization_Nova.pdf',
        page_number: 0,
        confidence: 0.0,
        rationale: 'Mandatory OEM Authorization Form (MAF) missing from uploaded document vault.'
      },
      {
        id: 'LAYER_LOCAL_CONTENT',
        title: 'Make in India Local Content Requirement',
        category: 'Technical Criteria',
        status: 'FAILED',
        extracted_value: '45.0% Class-II Supplier',
        expected_rule: 'Minimum >= 50.0% Class-I',
        govt_source_value: '45.0% DECLARED',
        source_document: 'MII_Declaration_Nova.pdf',
        page_number: 1,
        confidence: 0.99,
        rationale: 'Declared local content (45%) fails tender threshold requirement of >= 50% Class-I Local Supplier.'
      }
    ],
    telemetry: {
      typing_speed_wpm: 52,
      typing_cadence_std_dev_ms: 105,
      mouse_movement_entropy: 0.82,
      mouse_speed_pixels_per_sec: 450,
      click_interval_regularity: 0.28,
      time_spent_reviewing_sec: 140,
      session_platform: 'Web',
      device_user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Safari/605.1.15',
      automation_risk: 'NORMAL',
      automation_score: 18,
      rationale: 'Normal human session behavior.'
    },
    replay_timeline: [
      { id: 'ev-201', timestamp: '11:02:10', time_offset_sec: 0, event_type: 'LOGIN', title: 'Bidder Login', details: 'Logged in via 2FA.', status: 'GREEN', ip_masked: '115.110.xxx.12', platform: 'Web' },
      { id: 'ev-202', timestamp: '11:04:15', time_offset_sec: 125, event_type: 'TENDER_OPEN', title: 'Tender Review', details: 'Reviewed tender specs.', status: 'GREEN', ip_masked: '115.110.xxx.12', platform: 'Web' },
      { id: 'ev-203', timestamp: '11:06:50', time_offset_sec: 280, event_type: 'DOC_VERIFIED', title: 'Partial Document Upload', details: 'Uploaded GST & MII docs. OEM MAF skipped.', status: 'AMBER', ip_masked: '115.110.xxx.12', platform: 'Web' },
      { id: 'ev-204', timestamp: '11:09:12', time_offset_sec: 422, event_type: 'BID_ENTRY', title: 'Bid Entered', details: 'Submitted bid quote: ₹ 12,10,00,000.', status: 'GREEN', ip_masked: '115.110.xxx.12', platform: 'Web' }
    ]
  },
  {
    id: 3,
    bidder_code: 'BID-2026-003',
    company_name: 'Apex Cyber Solutions Pvt Ltd',
    pan: 'AACCA9999M',
    gstin: '07AACCA9999M1Z2', // Cancelled
    udyam_number: 'UDYAM-DL-03-0099999',
    cin: 'U72200DL2020PTC365432',
    email: 'contact@apexcyber.co.in',
    phone: '+91-11-98765432',
    registered_address: '402, Cyber Tower, Nehru Place, New Delhi - 110019',
    bidder_type: 'Private Limited',
    is_startup: true,
    is_msme: true,
    declared_turnover: 2.5, // Below 5 Cr
    declared_local_content: 35.0, // Below 50%
    created_at: '2026-08-12T14:00:00Z',
    compliance_score: 32.0,
    risk_level: 'HIGH',
    trust_rating: 'HIGH_RISK_SUSPECT',
    ai_recommendation: 'HIGH RISK ALERT: GSTIN is CANCELLED on Government GST portal. OEM Authorization expired on 2024-12-31. Financial turnover (₹2.5 Cr) fails minimum requirement of ₹5.0 Cr. Active debarment flag found on CPPP database.',
    recommendation_reasons: [
      'CRITICAL: GST Portal returns status CANCELLED for GSTIN 07AACCA9999M1Z2.',
      'CRITICAL: OEM Authorization Form expired on 2024-12-31 (Prior to tender notice).',
      'CRITICAL: 3-Year Average Turnover (₹2.5 Cr) is below mandatory threshold (₹5.0 Cr).',
      'CRITICAL: Active Debarment record found on CPPP Portal (Debarred for non-performance in Tender GEM/2024/B/5512).'
    ],
    officer_decision: 'PENDING',
    officer_notes: '',
    documents: [
      {
        id: 3001,
        bidder_id: 3,
        document_type: 'GST_CERT',
        document_name: 'GST Registration Certificate',
        filename: 'GST_Cert_Apex.pdf',
        file_size: 390000,
        upload_date: '2026-08-12T14:05:00Z',
        status: 'DISCREPANCY',
        page_count: 2,
        raw_text: 'GSTIN: 07AACCA9999M1Z2. Legal Name: Apex Cyber Solutions Pvt Ltd. Status: CANCELLED.',
        extracted_fields: [
          { field_name: 'gstin', field_value: '07AACCA9999M1Z2', confidence: 0.99, page_number: 1 },
          { field_name: 'status', field_value: 'CANCELLED', confidence: 0.99, page_number: 2 }
        ]
      },
      {
        id: 3002,
        bidder_id: 3,
        document_type: 'OEM_AUTH',
        document_name: 'Expired OEM Authorization',
        filename: 'OEM_MAF_Apex_Expired.pdf',
        file_size: 210000,
        upload_date: '2026-08-12T14:06:00Z',
        status: 'EXPIRED',
        page_count: 1,
        expiry_date: '2024-12-31',
        raw_text: 'OEM MAF Form. Valid through: 2024-12-31.',
        extracted_fields: [
          { field_name: 'authorization_expiry', field_value: '2024-12-31', confidence: 0.98, page_number: 1 }
        ]
      }
    ],
    verification_layers: [
      {
        id: 'LAYER_GST',
        title: 'GST Registration & Return Filing Compliance',
        category: 'GSTN Portal',
        status: 'FAILED',
        extracted_value: 'GSTIN: 07AACCA9999M1Z2',
        expected_rule: 'ACTIVE Taxpayer Status',
        govt_source_value: 'CANCELLED (SUO MOTU)',
        source_document: 'GST_Cert_Apex.pdf',
        page_number: 2,
        confidence: 0.99,
        rationale: 'CRITICAL: Government GST Portal reports GSTIN status as CANCELLED due to continuous non-filing of returns.'
      },
      {
        id: 'LAYER_OEM',
        title: 'Valid OEM Authorization Form (MAF)',
        category: 'Technical Eligibility',
        status: 'FAILED',
        extracted_value: 'Expired on 2024-12-31',
        expected_rule: 'Valid till 2026-09-30',
        govt_source_value: 'EXPIRED FORM',
        source_document: 'OEM_MAF_Apex_Expired.pdf',
        page_number: 1,
        confidence: 0.98,
        rationale: 'CRITICAL: Manufacturer Authorization Form expired over 20 months ago.'
      },
      {
        id: 'LAYER_TURNOVER',
        title: 'Minimum Financial Turnover (3-Yr Avg)',
        category: 'Financial Eligibility',
        status: 'FAILED',
        extracted_value: '₹ 2.5 Crores',
        expected_rule: 'Minimum >= ₹ 5.0 Crores',
        govt_source_value: '₹ 2.5 Cr DECLARED',
        source_document: 'GST_Cert_Apex.pdf',
        page_number: 1,
        confidence: 0.96,
        rationale: 'CRITICAL: Financial turnover falls 50% short of tender requirement.'
      },
      {
        id: 'LAYER_BLACKLIST',
        title: 'Blacklisting & Debarment Check',
        category: 'CPPP & GeM Debarment Database',
        status: 'FAILED',
        extracted_value: 'Debarred Entity Flag',
        expected_rule: 'Clean Debarment Record',
        govt_source_value: 'ACTIVE DEBARMENT MATCH',
        source_document: 'CPPP_Debarment_API',
        page_number: 1,
        confidence: 0.99,
        rationale: 'CRITICAL: Debarred by CPPP for non-delivery of items in Tender GEM/2024/B/5512 until 31-Dec-2027.'
      }
    ],
    telemetry: {
      typing_speed_wpm: 55,
      typing_cadence_std_dev_ms: 98,
      mouse_movement_entropy: 0.79,
      mouse_speed_pixels_per_sec: 480,
      click_interval_regularity: 0.31,
      time_spent_reviewing_sec: 110,
      session_platform: 'Web',
      device_user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Firefox/128.0',
      automation_risk: 'NORMAL',
      automation_score: 22,
      rationale: 'Human interaction detected, but critical statutory/document failures present.'
    },
    replay_timeline: [
      { id: 'ev-301', timestamp: '14:02:10', time_offset_sec: 0, event_type: 'LOGIN', title: 'Bidder Login', details: 'Logged in.', status: 'GREEN', ip_masked: '182.73.xxx.89', platform: 'Web' },
      { id: 'ev-302', timestamp: '14:05:00', time_offset_sec: 170, event_type: 'DOC_VERIFIED', title: 'Document OCR Flagged', details: 'Uploaded cancelled GST certificate and expired OEM auth.', status: 'RED', ip_masked: '182.73.xxx.89', platform: 'Web' },
      { id: 'ev-303', timestamp: '14:07:30', time_offset_sec: 320, event_type: 'SUBMISSION', title: 'Bid Submitted', details: 'Submitted bid quote despite critical document warnings.', status: 'RED', ip_masked: '182.73.xxx.89', platform: 'Web' }
    ]
  },
  {
    id: 4,
    bidder_code: 'BID-2026-004',
    company_name: 'Zenith Digital Corp',
    pan: 'AACCD4321P',
    gstin: '07AACCD4321P1Z8',
    udyam_number: 'UDYAM-DL-04-0012345',
    cin: 'U72900DL2019PTC345678',
    email: 'bids@zenithdigital.co.in',
    phone: '+91-11-33445566',
    registered_address: '501, Innovation Hub, Nehru Place, New Delhi - 110019',
    bidder_type: 'Private Limited',
    is_startup: true,
    is_msme: true,
    declared_turnover: 12.0,
    declared_local_content: 70.0,
    created_at: '2026-08-13T16:00:00Z',
    compliance_score: 84.0,
    risk_level: 'MEDIUM',
    trust_rating: 'NEEDS_OFFICER_REVIEW',
    ai_recommendation: 'BID SESSION ANOMALY DETECTED: Statutory documents are 100% compliant. However, bid session telemetry indicates potential automated/scripted bid placement (Bid submitted in 2.1 seconds with 0ms typing variance). Officer review recommended.',
    recommendation_reasons: [
      'Documents & Tax compliance verified 100% compliant.',
      'ANOMALY SIGNAL: Bid payload submitted in 2.1 seconds total session duration.',
      'ANOMALY SIGNAL: Keystroke cadence std dev = 0.8ms (Strong machine script indicator).',
      'ANOMALY SIGNAL: Mouse movement entropy = 0.02 (Linear robotic cursor path).'
    ],
    officer_decision: 'PENDING',
    officer_notes: '',
    documents: [
      {
        id: 4001,
        bidder_id: 4,
        document_type: 'GST_CERT',
        document_name: 'GST Registration Certificate',
        filename: 'GST_Cert_Zenith.pdf',
        file_size: 430000,
        upload_date: '2026-08-13T16:02:00Z',
        status: 'VERIFIED',
        page_count: 2,
        raw_text: 'GSTIN: 07AACCD4321P1Z8. Legal Name: Zenith Digital Corp. Status: ACTIVE.',
        extracted_fields: [
          { field_name: 'gstin', field_value: '07AACCD4321P1Z8', confidence: 0.99, page_number: 1 },
          { field_name: 'status', field_value: 'ACTIVE', confidence: 0.99, page_number: 1 }
        ]
      }
    ],
    verification_layers: [
      {
        id: 'LAYER_GST',
        title: 'GST Registration & Return Filing Compliance',
        category: 'GSTN Portal',
        status: 'PASSED',
        extracted_value: 'GSTIN: 07AACCD4321P1Z8',
        expected_rule: 'ACTIVE Taxpayer Status',
        govt_source_value: 'ACTIVE',
        source_document: 'GST_Cert_Zenith.pdf',
        page_number: 1,
        confidence: 0.99,
        rationale: 'Active GST registration verified.'
      },
      {
        id: 'LAYER_TELEMETRY',
        title: 'Bid-Session Intelligence & Automation Anomaly Signal',
        category: 'Session Intelligence (Module 17/18)',
        status: 'WARNING',
        extracted_value: 'Instantaneous Bid Submission (2.1s)',
        expected_rule: 'Normal Human Typing & Mouse Entropy',
        govt_source_value: 'POTENTIAL_AUTOMATION_SIGNAL',
        source_document: 'Session_Telemetry_Log',
        page_number: 1,
        confidence: 0.96,
        rationale: 'ANOMALY: Session telemetry detects 0ms typing variance and linear mouse trajectory. Potential automated script/bot activity during bid submission.'
      }
    ],
    telemetry: {
      typing_speed_wpm: 240, // unnaturally high
      typing_cadence_std_dev_ms: 0.8, // 0 variance = script
      mouse_movement_entropy: 0.02, // linear
      mouse_speed_pixels_per_sec: 2400,
      click_interval_regularity: 0.99, // perfectly regular
      time_spent_reviewing_sec: 2,
      session_platform: 'Web',
      device_user_agent: 'HeadlessChrome/128.0.0.0 (Automated Telemetry)',
      automation_risk: 'POTENTIAL_AUTOMATION',
      automation_score: 94,
      rationale: 'Scripted / Bot-Assisted Bidding pattern flagged. Instant submission telemetry detected.'
    },
    replay_timeline: [
      { id: 'ev-401', timestamp: '16:00:01', time_offset_sec: 0, event_type: 'LOGIN', title: 'Automated Session Connect', details: 'Session initialized.', status: 'GREEN', ip_masked: '45.12.xxx.90', platform: 'Web' },
      { id: 'ev-402', timestamp: '16:00:02', time_offset_sec: 1, event_type: 'TENDER_OPEN', title: 'Instant Tender Load', details: 'Tender loaded via script payload.', status: 'AMBER', ip_masked: '45.12.xxx.90', platform: 'Web' },
      { id: 'ev-403', timestamp: '16:00:03', time_offset_sec: 2, event_type: 'SUBMISSION', title: 'Instant Bid Placement', details: 'Bid submitted in 2.1s. Script telemetry flag recorded.', status: 'AMBER', ip_masked: '45.12.xxx.90', platform: 'Web' }
    ]
  }
];

export const MOCK_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 501,
    verification_id: 1,
    bidder_id: 1,
    tender_id: 1,
    user_name: 'Procurement Officer (Rajesh Kumar)',
    action: 'OFFICER_DECISION_QUALIFIED',
    object_type: 'Bidder',
    object_id: 'BID-2026-001',
    result: 'SUCCESS',
    source: 'OFFICER_ACTION',
    timestamp: '2026-09-02T12:00:00Z',
    details: 'Approved qualification for Bharat Technologies Pvt Ltd after reviewing complete 360° verification profile.'
  },
  {
    id: 502,
    verification_id: 1,
    bidder_id: 1,
    tender_id: 1,
    user_name: 'System AI Engine',
    action: 'CROSS_VERIFICATION_COMPLETED',
    object_type: 'VerificationResult',
    object_id: '1',
    result: 'SUCCESS',
    source: 'SYSTEM_AI',
    timestamp: '2026-09-02T11:55:00Z',
    details: 'Executed 3-way cross verification across 11 statutory and technical layers. Generated Score: 96/100.'
  },
  {
    id: 503,
    verification_id: 3,
    bidder_id: 3,
    tender_id: 1,
    user_name: 'System AI Engine',
    action: 'CRITICAL_DISCREPANCY_FLAGGED',
    object_type: 'Bidder',
    object_id: 'BID-2026-003',
    result: 'WARNING',
    source: 'GOVT_API',
    timestamp: '2026-09-02T11:45:00Z',
    details: 'GSTN Portal returned CANCELLED taxpayer status. CPPP portal returned active debarment record.'
  },
  {
    id: 504,
    verification_id: 4,
    bidder_id: 4,
    tender_id: 1,
    user_name: 'Session Telemetry Logger',
    action: 'BOT_AUTOMATION_SIGNAL_DETECTED',
    object_type: 'BidSession',
    object_id: 'BID-2026-004',
    result: 'WARNING',
    source: 'SYSTEM_AI',
    timestamp: '2026-09-02T11:30:00Z',
    details: 'Flagged potential automated script bidding activity (Bid entry duration: 2.1s, mouse entropy: 0.02).'
  }
];

export const MOCK_PUBLIC_TRANSPARENCY: PublicTenderSummary[] = [
  {
    tender_id: 'GEM/2026/B/894120',
    title: 'Procurement of High-Performance Rack Servers & AI Accelerators for NIC Data Center',
    tender_title: 'Procurement of High-Performance Rack Servers & AI Accelerators for NIC Data Center',
    department: 'Ministry of Electronics & Information Technology (MeitY)',
    bidders_count: 4,
    participating_bidders_count: 4,
    verified_qualified_count: 2,
    disqualified_count: 2,
    audit_status: '100% AUDITED',
    verification_progress_pct: 100,
    status: 'EVALUATION',
    verification_status: 'IN EVALUATION',
    published_date: '2026-08-01',
    closing_date: '2026-09-30',
    public_audit_summary: 'Bidding closed. 4 participating bidders evaluated across statutory, GSTN, Udyam, and technical criteria. Audit history logged.',
    compliance_summary: 'Automated 3-way cross-verification completed for 4 submitted bids. 2 bidders fully qualified, 1 flagged for missing OEM MAF authorization, 1 disqualified due to cancelled GST status.',
    award_value: '₹ 12.50 Crores',
    winning_bidder_masked: 'Bharat Tech****** Pvt Ltd (L1 Qualified)',
    public_timeline: [
      { event: 'Tender Published on GeM Portal', status: 'COMPLETED', time: '2026-08-01 10:00 IST' },
      { event: 'Bidding Period Closed', status: 'COMPLETED', time: '2026-08-15 17:00 IST' },
      { event: 'AI 3-Way Cross Verification Engine Execution', status: 'PASSED', time: '2026-08-16 09:15 IST' },
      { event: 'Government API (GSTN/Udyam/MCA21) Registry Audit', status: 'VERIFIED', time: '2026-08-16 09:30 IST' },
      { event: 'Procurement Officer Qualification Review', status: 'IN PROGRESS', time: '2026-08-17 11:00 IST' }
    ],
    outcome: 'Under Final Officer Evaluation'
  },
  {
    tender_id: 'GEM/2026/B/771204',
    title: 'Supply of Solar Power Systems & Inverters for Rural Telecom Towers',
    tender_title: 'Supply of Solar Power Systems & Inverters for Rural Telecom Towers',
    department: 'Department of Telecommunications (DoT)',
    bidders_count: 8,
    participating_bidders_count: 8,
    verified_qualified_count: 6,
    disqualified_count: 2,
    audit_status: 'VERIFIED & AWARDED',
    verification_progress_pct: 100,
    status: 'AWARDED',
    verification_status: 'AWARDED',
    published_date: '2026-06-15',
    closing_date: '2026-07-31',
    public_audit_summary: 'All 8 bidder submissions verified via automated government verification layer. Qualified bidder selected.',
    compliance_summary: 'All 8 submitted bids verified against statutory rules. 6 bidders met 100% eligibility criteria.',
    award_value: '₹ 8.75 Crores',
    winning_bidder_masked: 'Surya Solar Infra****** Pvt Ltd (Awarded L1)',
    public_timeline: [
      { event: 'Tender Published on GeM', status: 'COMPLETED', time: '2026-06-15 10:00 IST' },
      { event: 'AI Verification & Rule Engine Audit', status: 'PASSED', time: '2026-08-01 10:00 IST' },
      { event: 'Final Commercial Award Issued', status: 'COMPLETED', time: '2026-08-05 14:30 IST' }
    ],
    outcome: 'Awarded to L1 Compliant Bidder'
  }
];

export const MOCK_PUBLIC_TENDERS = MOCK_PUBLIC_TRANSPARENCY;

