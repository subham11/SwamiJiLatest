'use client';

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import styles from "./swamiji.module.css";

export default function SwamijiPage() {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';

  return (
    <main id="main-content" className={styles.main}>
      <NavBar />
      
      {/* Hero Section - Life Dedicated to Mantra Science */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            {/* Left Content */}
            <div className={styles.heroContent}>
              <span className={styles.badge}>
                {isHindi ? 'वंशधारी' : 'THE LINEAGE HOLDER'}
              </span>
              
              <h1 className={styles.heroTitle}>
                {isHindi ? (
                  <>
                    <span className={styles.titleLine}>एक जीवन समर्पित</span>
                    <span className={styles.titleHighlight}>मंत्र विज्ञान को</span>
                  </>
                ) : (
                  <>
                    <span className={styles.titleLine}>A Life Dedicated to</span>
                    <span className={styles.titleHighlight}>Mantra Science</span>
                  </>
                )}
              </h1>

              <p className={styles.heroDescription}>
                {isHindi 
                  ? <>स्वामी रुपेश्वरानंद जी एक प्रतिष्ठित <span className={styles.highlight}>मंत्र योगी</span> और आध्यात्मिक गुरु हैं जिन्होंने प्राचीन "शास्त्रोक्त" (शास्त्र-आधारित) पूजा पद्धतियों को पुनर्जीवित किया है।</>
                  : <>Swami Rupeshwaranand Ji is a distinguished <span className={styles.highlight}>Mantra Yogi</span> and spiritual master who has revived the ancient &quot;Shashtrokt&quot; (scripture-based) methodologies of worship.</>
                }
              </p>

              <p className={styles.heroSubDescription}>
                {isHindi 
                  ? '17 वर्ष की कोमल आयु में संसार छोड़कर, स्वामीजी ने तपस्या की कठोर यात्रा शुरू की। 25 से अधिक वर्षों से, वे मंत्र योग की गूढ़ साधनाओं में लीन हैं, बजरंगगढ़ की गुफाओं और वाराणसी के पवित्र घाटों में चेतना की गहराइयों की खोज कर रहे हैं।'
                  : 'Leaving worldly life at the tender age of 17, Swamiji embarked on a rigorous journey of asceticism. For over 25 years, he has been immersed in the esoteric practices of Mantra Yoga, exploring the depths of consciousness in the caves of Bajranggarh and the sacred ghats of Varanasi.'
                }
              </p>

              {/* Stats Cards */}
              <div className={styles.statsContainer}>
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>🔥</span>
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{isHindi ? '25+ वर्ष' : '25+ Years'}</span>
                    <span className={styles.statLabel}>{isHindi ? 'साधना' : 'SADHANA'}</span>
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <span className={styles.statIcon}>ॐ</span>
                  <div className={styles.statContent}>
                    <span className={styles.statValue}>{isHindi ? 'सिद्धपीठ' : 'Siddhapeeth'}</span>
                    <span className={styles.statLabel}>{isHindi ? 'संस्थापक' : 'FOUNDER'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className={styles.heroImageWrapper}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/SwamiJi/swami-ji-1.jpg"
                  alt="Swami Rupeshwaranand Ji"
                  width={450}
                  height={550}
                  className={styles.heroImage}
                  priority
                />
                <div className={styles.imageCaption}>
                  {isHindi ? 'स्वामी रुपेश्वरानंद जी' : 'SWAMI RUPESHWARANAND JI'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spiritual Journey Section */}
      <section className={styles.journeySection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            {isHindi ? 'आध्यात्मिक यात्रा' : 'Spiritual Journey'}
          </h2>
          
          <div className={styles.journeyGrid}>
            <div className={styles.journeyCard}>
              <div className={styles.journeyIcon}>🙏</div>
              <h3>{isHindi ? 'वैदिक शिक्षा' : 'Vedic Education'}</h3>
              <p>
                {isHindi 
                  ? 'बचपन से ही वेद, उपनिषद और पुराणों का गहन अध्ययन।'
                  : 'Deep study of Vedas, Upanishads and Puranas from early childhood.'
                }
              </p>
            </div>

            <div className={styles.journeyCard}>
              <div className={styles.journeyIcon}>🕉️</div>
              <h3>{isHindi ? 'मंत्र सिद्धि' : 'Mantra Siddhi'}</h3>
              <p>
                {isHindi 
                  ? 'लाखों मंत्रों के जप से प्राप्त दिव्य शक्तियाँ।'
                  : 'Divine powers attained through millions of mantra recitations.'
                }
              </p>
            </div>

            <div className={styles.journeyCard}>
              <div className={styles.journeyIcon}>🔱</div>
              <h3>{isHindi ? 'तंत्र विज्ञान' : 'Tantra Vidya'}</h3>
              <p>
                {isHindi 
                  ? 'प्राचीन तंत्र शास्त्रों की गोपनीय साधनाओं में पारंगत।'
                  : 'Mastery in secret practices of ancient Tantra scriptures.'
                }
              </p>
            </div>

            <div className={styles.journeyCard}>
              <div className={styles.journeyIcon}>✨</div>
              <h3>{isHindi ? 'शिष्य मार्गदर्शन' : 'Disciple Guidance'}</h3>
              <p>
                {isHindi 
                  ? 'हजारों शिष्यों को आध्यात्मिक मार्ग पर मार्गदर्शन।'
                  : 'Guiding thousands of disciples on the spiritual path.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Teachings Section */}
      <section className={styles.teachingsSection}>
        <div className={styles.container}>
          <div className={styles.teachingsGrid}>
            <div className={styles.teachingsImage}>
              <Image
                src="/images/SwamiJi/swami-ji-2.jpg"
                alt={isHindi ? 'स्वामीजी की शिक्षाएं' : 'Swamiji\'s Teachings'}
                width={500}
                height={400}
                className={styles.teachingImg}
              />
            </div>
            
            <div className={styles.teachingsContent}>
              <span className={styles.badge}>
                {isHindi ? 'पवित्र शिक्षाएं' : 'SACRED TEACHINGS'}
              </span>
              <h2 className={styles.teachingsTitle}>
                {isHindi ? 'दिव्य ज्ञान की धारा' : 'The Stream of Divine Knowledge'}
              </h2>
              <p>
                {isHindi 
                  ? 'स्वामीजी की शिक्षाएं प्राचीन वैदिक ज्ञान और आधुनिक जीवन की चुनौतियों का अद्भुत संगम हैं। वे सरल भाषा में गहन आध्यात्मिक सत्य प्रकट करते हैं।'
                  : 'Swamiji\'s teachings are a wonderful confluence of ancient Vedic knowledge and modern life challenges. He reveals profound spiritual truths in simple language.'
                }
              </p>
              <ul className={styles.teachingsList}>
                <li>{isHindi ? 'मंत्र योग और ध्यान की विधियाँ' : 'Mantra Yoga and Meditation Techniques'}</li>
                <li>{isHindi ? 'कर्म और धर्म का मार्ग' : 'The Path of Karma and Dharma'}</li>
                <li>{isHindi ? 'आत्म-साक्षात्कार की प्रक्रिया' : 'The Process of Self-Realization'}</li>
                <li>{isHindi ? 'भक्ति और समर्पण का महत्व' : 'Importance of Devotion and Surrender'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className={styles.quoteSection}>
        <div className={styles.container}>
          <blockquote className={styles.quote}>
            <span className={styles.quoteIcon}>&ldquo;</span>
            {isHindi 
              ? 'मंत्र केवल शब्द नहीं हैं, वे ब्रह्मांडीय ऊर्जा के वाहक हैं। जब सही विधि और भाव से जप किया जाता है, तो वे जीवन को रूपांतरित कर देते हैं।'
              : 'Mantras are not just words, they are carriers of cosmic energy. When chanted with the right method and devotion, they transform lives.'
            }
            <footer className={styles.quoteAuthor}>
              — {isHindi ? 'स्वामी रुपेश्वरानंद जी' : 'Swami Rupeshwaranand Ji'}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* Life Events Timeline Section */}
      <section className={styles.lifeEventsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            {isHindi ? 'जीवन की प्रमुख घटनाएं' : 'Life Events'}
          </h2>
          
          <div className={styles.timeline}>
            {/* Event 1 - Age 10 */}
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <span>🙒</span>
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>
                  {isHindi ? 'आयु 10' : 'Age 10'}
                </span>
                <h3 className={styles.timelineTitle}>
                  {isHindi ? 'दिव्य पुकार' : 'Divine Calling'}
                </h3>
                <p className={styles.timelineDescription}>
                  {isHindi 
                    ? 'बहुत कम उम्र से ही, भक्ति, पूजा और मंत्र जप के प्रति तीव्र झुकाव प्रकट हुआ। जब अन्य बच्चे खेलते थे, युवा स्वामीजी मंदिरों की शांति की ओर आकर्षित होते थे।'
                    : 'From a very tender age, an intense inclination towards devotion, worship, and mantra chanting manifested. While other children played, young Swamiji was drawn to the silence of temples.'
                  }
                </p>
              </div>
            </div>

            {/* Event 2 - Age 17 */}
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <span>🏔️</span>
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>
                  {isHindi ? 'आयु 17' : 'Age 17'}
                </span>
                <h3 className={styles.timelineTitle}>
                  {isHindi ? 'संन्यास ग्रहण' : 'Renunciation (Sannyasa)'}
                </h3>
                <p className={styles.timelineDescription}>
                  {isHindi 
                    ? 'आंतरिक पुकार सुनकर, स्वामीजी ने अपना घर और परिवार छोड़कर साधु का जीवन अपनाया। उन्होंने सभी सांसारिक सुखों को त्यागकर, पूर्ण रूप से सत्य की खोज में समर्पित हो गए।'
                    : 'Listening to the inner call, Swamiji left his home and family to embrace the life of a Sadhu. He dedicated himself entirely to the pursuit of truth, leaving behind all worldly comforts.'
                  }
                </p>
              </div>
            </div>

            {/* Event 3 - Cave Years */}
            <div className={styles.timelineItem}>
              <div className={styles.timelineIcon}>
                <span>🧘</span>
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>
                  {isHindi ? 'गुफा वर्ष' : 'The Cave Years'}
                </span>
                <h3 className={styles.timelineTitle}>
                  {isHindi ? 'बजरंगगढ़ में तपस्या' : 'Tapasya at Bajranggarh'}
                </h3>
                <p className={styles.timelineDescription}>
                  {isHindi 
                    ? '4-5 वर्षों तक, स्वामीजी ने बजरंगगढ़, गुना (म.प्र.) की एक दूरस्थ गुफा में तीव्र एकांत साधना की। मानव संपर्क से दूर, उन्होंने उग्र (भयंकर) मंत्रों को सिद्ध किया।'
                    : 'For 4-5 years, Swamiji performed intense solitary sadhana in a remote cave in Bajranggarh, Guna (M.P.). Isolated from human contact, he perfected the Ugra (fierce) mantras.'
                  }
                </p>
              </div>
            </div>

            {/* Event 4 - Present Day */}
            <div className={`${styles.timelineItem} ${styles.timelineItemHighlight}`}>
              <div className={styles.timelineIcon}>
                <span>🏛️</span>
              </div>
              <div className={styles.timelineContent}>
                <span className={styles.timelineLabel}>
                  {isHindi ? 'वर्तमान' : 'Present Day'}
                </span>
                <h3 className={styles.timelineTitle}>
                  {isHindi ? 'श्री पीतांबरा सिद्धपीठ' : 'Shri Pitambara Siddhapeeth'}
                </h3>
                <p className={styles.timelineDescription}>
                  {isHindi 
                    ? <>पिछले 28 वर्षों से, स्वामीजी <strong>श्री बलुआ घाट, वाराणसी</strong> में स्थापित हैं। यहाँ, उन्होंने गृहस्थों को प्रामाणिक वैदिक साधनाओं और राष्ट्र कल्याण के लिए &quot;बजरंग बाण&quot; अभियान में मार्गदर्शन करने के लिए आश्रम की स्थापना की।</>
                    : <>For the last 28 years, Swamiji has been established at <strong>Shri Balua Ghat, Varanasi</strong>. Here, he established the Ashram to guide householders in authentic Vedic practices and the &quot;Bajarang Baan&quot; campaign for national welfare.</>
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>
            {isHindi ? 'दिव्य मिशन' : 'Divine Mission'}
          </h2>
          
          <div className={styles.missionContent}>
            <div className={styles.missionCard}>
              <h3>{isHindi ? 'बजरंग बाण अभियान' : 'Bajrang Baan Abhiyan'}</h3>
              <p>
                {isHindi 
                  ? '11 करोड़ बजरंग बाण पाठ का महाअभियान - हनुमान जी की कृपा से विश्व कल्याण हेतु।'
                  : 'The grand campaign of 11 crore Bajrang Baan recitations - for world welfare through the grace of Lord Hanuman.'
                }
              </p>
            </div>
            
            <div className={styles.missionCard}>
              <h3>{isHindi ? 'सिद्धपीठ की स्थापना' : 'Establishment of Siddhapeeth'}</h3>
              <p>
                {isHindi 
                  ? 'साधकों के लिए एक दिव्य स्थान जहाँ वे आध्यात्मिक साधना कर सकें।'
                  : 'A divine place for seekers where they can practice spiritual sadhana.'
                }
              </p>
            </div>
            
            <div className={styles.missionCard}>
              <h3>{isHindi ? 'वैदिक ज्ञान का प्रसार' : 'Spreading Vedic Knowledge'}</h3>
              <p>
                {isHindi 
                  ? 'प्राचीन शास्त्रों के ज्ञान को आम जन तक पहुँचाना।'
                  : 'Bringing the knowledge of ancient scriptures to the common people.'
                }
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
