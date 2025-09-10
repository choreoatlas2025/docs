/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    'intro',
    'installation',
    'quickstart',
    {
      type: 'category',
      label: 'Core Concepts',
      items: [
        'concepts/dual-contracts',
        'concepts/servicespec',
        'concepts/flowspec',
        'concepts/choreography',
      ],
    },
    {
      type: 'category',
      label: 'ServiceSpec Guide',
      items: [
        'servicespec/overview',
        'servicespec/syntax',
        'servicespec/preconditions',
        'servicespec/postconditions',
        'servicespec/examples',
      ],
    },
    {
      type: 'category',
      label: 'FlowSpec Guide',
      items: [
        'flowspec/overview',
        'flowspec/syntax',
        'flowspec/temporal-ordering',
        'flowspec/dependencies',
        'flowspec/error-handling',
        'flowspec/examples',
      ],
    },
    {
      type: 'category',
      label: 'CLI Commands',
      items: [
        'cli/discover',
        'cli/validate',
        'cli/lint',
        'cli/ci-gate',
      ],
    },
    {
      type: 'category',
      label: 'Reports & Analysis',
      items: [
        'reports/html-reports',
        'reports/json-output',
        'reports/junit-integration',
        'reports/baseline-thresholds',
      ],
    },
    {
      type: 'category',
      label: 'CI/CD Integration',
      items: [
        'ci-cd/github-actions',
        'ci-cd/gitlab-ci',
        'ci-cd/jenkins',
        'ci-cd/pre-commit-hooks',
      ],
    },
    {
      type: 'category',
      label: 'Templates & Examples',
      items: [
        'templates/http-services',
        'templates/grpc-services',
        'templates/kafka-flows',
        'templates/database-interactions',
      ],
    },
    {
      type: 'category',
      label: 'Advanced Topics',
      items: [
        'advanced/editions',
        'advanced/telemetry-privacy',
        'advanced/custom-schemas',
        'advanced/enterprise-features',
      ],
    },
    'faq',
    'troubleshooting',
    'contributing',
  ],

  // But you can create a sidebar manually
  /*
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
   */
};

module.exports = sidebars;