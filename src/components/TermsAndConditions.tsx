
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsAndConditions = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="enhanced-glass-card bg-white/20 backdrop-blur-lg border-white/30 p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Terms and Conditions</h1>
        
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6 text-sm text-gray-700">
            
            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using FrenAI.app ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">2. Service Description</h2>
              <p>
                FrenAI.app provides AI-powered chat services, avatar generation, and cryptocurrency-related information. 
                The service is provided "as is" without any warranties, express or implied.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">3. Financial Disclaimer</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="font-semibold text-red-800 mb-2">IMPORTANT FINANCIAL DISCLAIMER:</p>
                <ul className="list-disc list-inside space-y-2 text-red-700">
                  <li>FrenAI.app does NOT provide financial, investment, or trading advice</li>
                  <li>All content is for informational and entertainment purposes only</li>
                  <li>Cryptocurrency investments are highly risky and volatile</li>
                  <li>You may lose all your invested capital</li>
                  <li>Past performance does not guarantee future results</li>
                  <li>Always consult with qualified financial advisors before making investment decisions</li>
                  <li>We are not responsible for any financial losses incurred from using our service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">4. AI-Generated Content Disclaimer</h2>
              <p>
                Our AI may produce inaccurate, incomplete, or misleading information. Users should verify all information independently. 
                FrenAI.app is not responsible for decisions made based on AI-generated content.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">5. User Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>You must be at least 18 years old to use this service</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree not to use the service for illegal activities</li>
                <li>You will not attempt to reverse engineer or exploit our systems</li>
                <li>You will not share inappropriate, harmful, or offensive content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">6. Intellectual Property</h2>
              <p>
                All content, trademarks, and intellectual property on FrenAI.app are owned by us or our licensors. 
                Users retain rights to content they create, but grant us a license to use, display, and distribute such content through our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">7. Privacy and Data</h2>
              <p>
                We collect and process data as described in our Privacy Policy. By using our service, you consent to such collection and processing. 
                We implement reasonable security measures but cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">8. Limitation of Liability</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, FRENAI.APP SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO FINANCIAL LOSSES, 
                  DATA LOSS, OR BUSINESS INTERRUPTION.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">9. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless FrenAI.app from any claims, damages, losses, or expenses 
                arising from your use of the service or violation of these terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">10. Service Availability</h2>
              <p>
                We strive for high availability but do not guarantee uninterrupted service. We reserve the right to 
                modify, suspend, or discontinue the service at any time without notice.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">11. Third-Party Services</h2>
              <p>
                Our service may integrate with third-party services (wallet providers, APIs, etc.). 
                We are not responsible for the availability, accuracy, or security of third-party services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">12. Termination</h2>
              <p>
                We may terminate or suspend your access immediately, without prior notice, for any reason, 
                including breach of these terms. Upon termination, your right to use the service ceases immediately.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">13. Governing Law</h2>
              <p>
                These terms shall be governed by and construed in accordance with applicable laws. 
                Any disputes shall be resolved through binding arbitration.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                Continued use of the service constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">15. Contact Information</h2>
              <p>
                For questions about these terms, please contact us at: hellofrens@frenai.app
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </section>

          </div>
        </ScrollArea>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
