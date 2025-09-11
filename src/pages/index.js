import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Get Started - 5min ⏱️
          </Link>
        </div>
      </div>
    </header>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Service-level Semantic Verification',
      description: (
        <>
          ServiceSpec contracts define preconditions and postconditions for each operation,
          enabling CEL-based semantic validation beyond simple schema checking.
        </>
      ),
    },
    {
      title: 'Orchestration-level Temporal Verification', 
      description: (
        <>
          FlowSpec contracts define step sequences and data flow,
          enabling temporal, causal, and DAG validation of service choreography.
        </>
      ),
    },
    {
      title: 'Real Trace-driven Validation',
      description: (
        <>
          Validate contracts against actual execution traces (JSON/OTLP),
          bridging the gap between design and runtime behavior.
        </>
      ),
    },
  ];

  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((feature, idx) => (
            <div key={idx} className="col col--4">
              <div className="text--center padding-horiz--md">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} - Map. Verify. Steer cross-service choreography`}
      description="Contract-as-Code governance platform with dual contracts (ServiceSpec & FlowSpec) for semantic and temporal validation">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}