import { Separator } from "@/components/ui/separator";

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl py-12 mx-auto flex justify-center">
      <div className="space-y-8">
        {/* Privacy Policy Section */}
        <section>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy & Terms of Service</h1>
          <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
          <p className="text-muted-foreground mb-4">Last Updated: February 17, 2025</p>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Your Data Rights</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>You own your data</li>
                <li>We do not sell or share your data with third parties</li>
                <li>We only collect essential information needed to provide our service</li>
                <li>You can request deletion of your data at any time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">What We Collect</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Basic account information (email, name)</li>
                <li>Usage data for service improvement</li>
                <li>Data you explicitly share with us</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">How We Use Data</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>To provide and improve our service</li>
                <li>To communicate with you about our service</li>
                <li>To ensure security and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Data Security</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>We use industry-standard security measures</li>
                <li>Your data is encrypted in transit and at rest</li>
                <li>We regularly review and update our security practices</li>
              </ul>
            </div>
          </div>
        </section>

        <Separator className="my-8" />

        {/* Terms of Service Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Terms of Service</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Service Usage</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Users must be 13 years or older</li>
                <li>Accounts must provide accurate information</li>
                <li>Users are responsible for maintaining account security</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Your Content</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>You retain ownership of your content</li>
                <li>You grant us license to host and share your content as needed for service operation</li>
                <li>You agree not to upload illegal or harmful content</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Service Changes</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>We may modify the service with notice</li>
                <li>We will notify you of significant changes</li>
                <li>You can terminate your account at any time</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Termination</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>We may suspend or terminate accounts that:</li>
                <li className="list-none pl-6">
                  <ul className="list-disc space-y-1">
                    <li>Violate our terms</li>
                    <li>Engage in harmful behavior</li>
                    <li>Remain inactive for extended periods</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Liability</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Service provided &quot;as is&quot;</li>
                <li>We are not liable for data loss or service interruptions</li>
                <li>You are responsible for backing up your data</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2">Contact</h3>
              <p className="mb-2">For questions or concerns:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Slack</li>
                <li>Response time: Within 24 hours</li>
                <li>Email: TBD</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
