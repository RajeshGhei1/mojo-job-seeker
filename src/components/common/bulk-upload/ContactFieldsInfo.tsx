
import React from 'react';

const ContactFieldsInfo: React.FC = () => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-2">Business Contact Fields:</h4>
      <div className="grid grid-cols-2 gap-2 text-sm text-blue-800">
        <div>
          <strong>Required Fields:</strong>
          <ul className="mt-1 space-y-1">
            <li>• full_name</li>
            <li>• email</li>
          </ul>
        </div>
        <div>
          <strong>Optional Fields:</strong>
          <ul className="mt-1 space-y-1 max-h-32 overflow-y-auto">
            <li>• phone</li>
            <li>• location</li>
            <li>• personal_email</li>
            <li>• role</li>
            <li>• company_name</li>
            <li>• reports_to_name</li>
            <li>• direct_reports</li>
            <li>• linkedin_url</li>
            <li>• current_title</li>
            <li>• current_company</li>
            <li>• experience_years</li>
            <li>• skills (comma-separated)</li>
            <li>• notes</li>
            <li>• availability_date</li>
            <li>• desired_salary</li>
            <li>• resume_url</li>
            <li>• portfolio_url</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContactFieldsInfo;
