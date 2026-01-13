import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import {
  ArrowLeft,
} from 'lucide-react-native';
import { Images } from '../../assets/images';

interface ContactOption {
  id: number;
  title: string;
  subtitle: string;
  icon: ImageSourcePropType;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  icon: ImageSourcePropType;
}

const SupportScreen = ({ navigation }: { navigation: any }) => {
  const contactOptions: ContactOption[] = [
    {
      id: 1,
      title: 'WhatsApp Support',
      subtitle: 'Quick response within minutes',
      icon: Images.whatsappIcon,
    },
    {
      id: 2,
      title: 'Email Support',
      subtitle: 'Support@skyborne.app',
      icon: Images.emailIcon,
    },
  ];

  const faqItems: FAQItem[] = [
    {
      id: 1,
      question: 'How do i join a live class?',
      answer:
        'Go to the schedule tab, find a class marked "LIVE" tap on it to see details and click "join live class" at the schedule time',
      icon: Images.questionIcon,
    },
    {
      id: 2,
      question: 'Can i watch recorded classes anytime?',
      answer:
        'Yes! Classes marked as "REPLAY" can be watched anytime. They count towards your session limit',
      icon: Images.questionIcon,
    },
    {
      id: 3,
      question: 'How do i upgrade my plan?',
      answer:
        'Go to profile>Subscription to view available plans and upgrade your membership',
      icon: Images.questionIcon,
    },
    {
      id: 4,
      question: 'What if i miss a live class?',
      answer:
        "Don't worry! All live classes are recorded and available as replays within 24 hours.",
      icon: Images.questionIcon,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Support</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Get in Touch Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Get in touch</Text>
        </View>

        <View style={styles.contactContainer}>
          {contactOptions.map((option, index) => (
            <View key={option.id}>
              <TouchableOpacity style={styles.contactItem}>
                <View style={styles.contactIconContainer}>
                  <Image source={option.icon}  />
                </View>
                <View style={styles.contactTextContainer}>
                  <Text style={styles.contactTitle}>{option.title}</Text>
                  <Text style={styles.contactSubtitle}>{option.subtitle}</Text>
                </View>
                <Image source={Images.rightIcon}/>
              </TouchableOpacity>
              {index < contactOptions.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* FAQ Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Frequently asked questions</Text>
        </View>

        <View style={styles.faqList}>
          {faqItems.map((item) => (
            <View key={item.id} style={styles.faqCard}>
              <Image source={item.icon} style={styles.faqIcon} />
              <View style={styles.faqContent}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            </View>
          ))}
        </View>
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 48,
  },
  backButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  // Section Headers
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 26,
  },
  sectionTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 20,
    lineHeight: 22,
    color: '#494949',
  },
  // Contact Container
  contactContainer: {
    marginHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 17.52,
    paddingHorizontal: 22,
    paddingVertical: 23,
    marginBottom: 40,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 76,
  },
  contactIconContainer: {
    width: 52,
    height: 52,
    backgroundColor: '#FFE8E8',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactIcon: {
    width: 24,
    height: 24,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.01,
    color: '#494949',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(5, 5, 5, 0.5)',
  },
  divider: {
    height: 1,
    backgroundColor: '#494949',
    opacity: 0.1,
    marginTop: 21,
    marginBottom: 28,
  },
  // FAQ List
  faqList: {
    paddingHorizontal: 16,
    marginBottom: 48,
  },
  faqCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  faqIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  faqContent: {
    flex: 1,
  },
  faqQuestion: {
    fontFamily: 'Satoshi-Bold',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 15.4,
    color: '#494949',
    marginBottom: 6,
  },
  faqAnswer: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    lineHeight: 18,
    width: 277,
    color: '#050505',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default SupportScreen;