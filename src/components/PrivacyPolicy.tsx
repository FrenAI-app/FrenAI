
import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="enhanced-glass-card bg-white/20 backdrop-blur-lg border-white/30 p-8">
        <h1 className="text-3xl font-bold text-purple-800 mb-6 text-center">Privacy Policy</h1>
        
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-6 text-sm text-gray-700">
            
            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">1. Information We Collect</h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold">Personal Information:</h3>
                  <ul className="list-disc list-inside ml-4">
                    <li>Email addresses (when you create an account)</li>
                    <li>Wallet addresses (when you connect a crypto wallet)</li>
                    <li>User-generated content (chat messages, avatars)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Technical Information:</h3>
                  <ul className="list-disc list-inside ml-4">
                    <li>IP addresses and browser information</li>
                    <li>Device information and operating system</li>
                    <li>Usage patterns and interaction data</li>
                    <li>Cookies and local storage data</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>To provide and improve our AI chat services</li>
                <li>To generate personalized avatars and content</li>
                <li>To authenticate users and maintain accounts</li>
                <li>To analyze usage patterns and optimize performance</li>
                <li>To communicate with users about service updates</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">3. Information Sharing</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold mb-2">We DO NOT sell your personal information.</p>
                <p>We may share information only in these limited circumstances:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>With service providers who assist in operations</li>
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and prevent fraud</li>
                  <li>With your explicit consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">4. Data Storage and Security</h2>
              <p>
                We implement industry-standard security measures to protect your data. However, no method of transmission 
                over the internet is 100% secure. We store data using secure cloud providers and encrypt sensitive information.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">5. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance user experience, remember preferences, and analyze usage. 
                You can control cookie settings through your browser, but this may affect service functionality.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">6. Your Rights</h2>
              <p>Depending on your jurisdiction, you may have the right to:</p>
              <ul className="list-disc list-inside space-y-2 mt-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Restrict processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">7. Children's Privacy</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="font-semibold">
                  Our service is not intended for children under 18. We do not knowingly collect personal information 
                  from children. If we become aware of such collection, we will delete the information immediately.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">8. International Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">9. Data Retention</h2>
              <p>
                We retain your information only as long as necessary to provide services or as required by law. 
                Account data is typically deleted within 30 days of account closure.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">10. Updates to This Policy</h2>
              <p>
                We may update this privacy policy periodically. We will notify users of significant changes 
                via email or prominent notice on our service.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-purple-700 mb-3">11. Contact Us</h2>
              <p>
                For privacy-related questions or to exercise your rights, contact us at: hellofrens@frenai.app
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

export default PrivacyPolicy;
