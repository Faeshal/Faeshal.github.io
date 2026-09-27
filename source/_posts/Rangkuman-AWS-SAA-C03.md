---
title: Rangkuman Luar Kepala - AWS Solutions Architect Associate
date: 2026-09-25 20:48:00
tags:
  - aws
  - certification
  - saa-c03
categories:
  - cloud
---

Saya baru saja lulus sertifikasi **[AWS Certified Solutions Architect – Associate (SAA-C03)](https://aws.amazon.com/id/certification/certified-solutions-architect-associate/)** untuk yang kedua kalinya, karena sertifikat AWS hanya berlaku 3 tahun dan sertifikat sebelumnya expired bulan ini, September 2026. Sebagai orang dengan latar belakang developer, jalur Solutions Architect terasa paling sulit bagi saya pribadi. Karena itu, saya susun catatan belajar ini dengan bahasa yang semoga mudah dipahami. Saya bagikan di sini agar tidak sekedar tersimpan sendiri — semoga menjadi amal jariyah & bermanfaat.

Beberapa catatan sebelum masuk ke materi:

- Ini catatan pribadi berbahasa Indonesia, bukan materi resmi AWS. Poin yang bersumber di luar catatan utama saya ditandai dengan simbol ⚠️.
- Formatnya sengaja padat dan banyak tabel perbandingan, karena sebagian besar soal SAA-C03 menguji kemampuan membedakan layanan yang mirip.
- Urutan prioritas (🔴 Tinggi, 🟠 Sedang, ⚪ Rendah) disusun berdasarkan pengalaman pribadi saya di ujian sesungguhnya.

Selamat belajar.

---

## 1. Networking & Content Delivery

### Amazon VPC 🔴 _Prioritas Tinggi_

CIDR block Amazon VPC berkisar antara /16 hingga /28, dan tidak dapat diubah setelah VPC dibuat. Setiap subnet hanya dapat berada di satu Availability Zone, dan AWS mereservasi lima alamat IP di setiap subnet untuk keperluan internal.

#### Security Group vs Network ACL

Ini adalah salah satu pasangan yang paling sering menjadi jebakan di ujian.

| Aspek                         | Security Group                                    | Network ACL                                                |
| ----------------------------- | ------------------------------------------------- | ---------------------------------------------------------- |
| Level operasi                 | Instance / ENI                                    | Subnet                                                     |
| Jenis rule                    | Hanya _allow_ (implicit deny di akhir)            | Mendukung _allow_ dan _deny_                               |
| Sifat                         | Stateful (traffic balik otomatis diizinkan)       | Stateless (traffic balik harus diizinkan secara eksplisit) |
| Evaluasi rule                 | Semua rule dievaluasi                             | Berurutan sesuai nomor rule, berhenti pada match pertama   |
| Cakupan                       | Harus diasosiasikan secara eksplisit per instance | Otomatis berlaku untuk seluruh instance dalam subnet       |
| Memblokir IP tertentu         | Tidak bisa                                        | Bisa — ini mekanisme yang tepat untuk kebutuhan tersebut   |
| Default pada konfigurasi baru | Deny semua inbound, allow semua outbound          | Deny semua hingga ditambahkan rule                         |

Jika sebuah soal menyebutkan "masalah konektivitas antar-subnet", kecurigaan pertama sebaiknya diarahkan ke Security Group atau Network ACL — bukan route table, karena _local route_ pada route table tidak dapat dihapus.

Beberapa poin tambahan seputar VPC:

- **NAT Gateway** bersifat _managed_, tersedia secara _highly available_ per Availability Zone, dengan bandwidth hingga 45 Gbps, namun tidak dapat difungsikan sebagai bastion host.
- **NAT Instance** bersifat _self-managed_, dapat difungsikan sebagai bastion host, tetapi wajib menonaktifkan fitur _source/destination check_.
- **VPC Peering** bersifat _one-to-one_ dan **tidak transitif** — CIDR pada kedua VPC tidak boleh saling tumpang tindih. Batas default adalah 50 koneksi peering, dengan maksimum hingga 125.
- **VPC Flow Logs** tidak dapat diberi tag maupun dikonfigurasi ulang setelah dibuat, dan tidak menangkap traffic DNS, DHCP, metadata instance, maupun Time Sync.

#### Memahami Keluarga "Gateway" dan VPC Endpoint

Salah satu sumber kebingungan terbesar di topik networking AWS adalah banyaknya istilah yang mengandung kata "Gateway". Prinsip dasarnya sederhana: **"Gateway" adalah pintu masuk/keluar VPC**, sedangkan **"Endpoint" adalah jalur privat menuju satu layanan AWS tertentu**.

| Nama                                     | Fungsi                                                                                               | Cakupan                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| **Internet Gateway (IGW)**               | Pintu penghubung dua arah antara VPC dengan internet publik                                          | Untuk subnet publik                                         |
| **NAT Gateway**                          | Memungkinkan instance di private subnet mengakses internet secara _outbound_ saja                    | Ditempatkan di public subnet, digunakan oleh private subnet |
| **Egress-only Internet Gateway**         | Setara NAT Gateway, khusus untuk IPv6 (stateful, outbound-only)                                      | Untuk subnet dengan IPv6                                    |
| **Virtual Private Gateway (VGW)**        | Sisi AWS dari koneksi Site-to-Site VPN atau Direct Connect                                           | Umumnya satu VGW per VPC                                    |
| **Customer Gateway (CGW)**               | Sisi on-premises dari koneksi VPN, merepresentasikan router/firewall pelanggan                       | Pasangan dari VGW                                           |
| **Transit Gateway (TGW)**                | Hub pusat untuk menghubungkan banyak VPC dan on-premises sekaligus, cukup satu attachment per VPC    | Lintas VPC, dapat lintas region                             |
| **Direct Connect Gateway**               | Menghubungkan satu koneksi Direct Connect ke banyak VPC di region berbeda                            | Khusus konteks Direct Connect                               |
| **VPC Gateway Endpoint**                 | Jalur privat khusus menuju S3 dan DynamoDB, tanpa biaya tambahan, tanpa memerlukan internet atau NAT | Hanya untuk dua layanan tersebut                            |
| **VPC Interface Endpoint (PrivateLink)** | Jalur privat menuju hampir seluruh layanan AWS lainnya melalui ENI, dikenakan biaya                  | Sebagian besar layanan AWS lainnya                          |

Cara paling cepat membedakannya dalam soal: jika kebutuhannya adalah mengakses S3 atau DynamoDB tanpa melalui internet dan tanpa biaya tambahan, jawabannya adalah **Gateway Endpoint**. Jika kebutuhannya mengakses layanan AWS lain (di luar S3/DynamoDB) tanpa internet, jawabannya adalah **Interface Endpoint/PrivateLink**. Jika kebutuhannya menghubungkan banyak VPC sekaligus tanpa membangun peering satu per satu, jawabannya adalah **Transit Gateway**. Jika kebutuhannya adalah sisi AWS dari sebuah koneksi VPN/Direct Connect, jawabannya adalah **Virtual Private Gateway**.

### Elastic Load Balancing (ELB) 🔴 _Prioritas Tinggi_

| Jenis                               | Layer                 | Karakteristik                                                                                         |
| ----------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| **Application Load Balancer (ALB)** | Layer 7 (HTTP/HTTPS)  | Mendukung host/path-based routing, paling fleksibel untuk aplikasi web                                |
| **Network Load Balancer (NLB)**     | Layer 4 (TCP/UDP/TLS) | IP statis per Availability Zone, performa sangat tinggi (jutaan request/detik), latency sangat rendah |
| **Gateway Load Balancer**           | Layer 3/4             | Menyisipkan virtual appliance pihak ketiga (firewall, IDS) secara transparan di jalur traffic         |
| **Classic Load Balancer (CLB)**     | Layer 4/7 terbatas    | Layanan lama (_legacy_), sebaiknya dihindari untuk kebutuhan baru                                     |

Beberapa poin penting lainnya:

- _Cross-zone load balancing_ secara default **aktif** pada ALB, namun secara default **nonaktif** pada NLB — ini merupakan jebakan klasik yang cukup sering muncul.
- ELB tidak mendukung autentikasi client certificate, berbeda dengan API Gateway.
- Mekanisme _health check_ pada ELB bersifat "fail open": apabila seluruh target pada satu Availability Zone berstatus _unhealthy_, traffic tetap akan dikirimkan ke seluruh target tersebut.
- **Listener** adalah konfigurasi port dan protokol yang "didengarkan" oleh ELB dari sisi client (misalnya port 443 untuk HTTPS). Setiap listener memiliki _rule_ yang menentukan target group tujuan — pada ALB, rule dapat dibuat berdasarkan host header maupun path.

### Amazon Route 53 🔴 _Prioritas Tinggi_

_Alias record_ bersifat gratis, dapat digunakan pada zone apex, namun hanya dapat diarahkan ke resource AWS tertentu. Sebaliknya, CNAME dikenakan biaya dan tidak dapat digunakan pada zone apex.

#### Tujuh Jenis Routing Policy

| Routing Policy   | Kapan Digunakan                                                                                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Simple**       | Satu resource, tanpa health check                                                                                                                 |
| **Weighted**     | Distribusi traffic berdasarkan persentase, misalnya untuk A/B testing atau canary release                                                         |
| **Latency**      | Mengarahkan user ke region dengan latency terendah                                                                                                |
| **Failover**     | Konfigurasi primary/secondary — otomatis beralih ke secondary saat primary _unhealthy_, umum digunakan pada skenario disaster recovery            |
| **Geolocation**  | Routing berdasarkan lokasi geografis user, untuk kebutuhan compliance atau lokalisasi konten                                                      |
| **Geoproximity** | Serupa dengan Geolocation, namun memungkinkan penyesuaian _bias_ untuk menggeser proporsi traffic antar region — memerlukan Route 53 Traffic Flow |
| **Multivalue**   | Mengembalikan hingga delapan record sekaligus disertai health check — bukan pengganti load balancer sesungguhnya                                  |

_Private hosted zone_ memerlukan atribut `enableDnsHostname` dan `enableDnsSupport` bernilai _true_, dan tidak melakukan registrasi otomatis terhadap instance EC2.

### Amazon CloudFront 🔴 _Prioritas Tinggi_

Hanya request GET dan HEAD yang di-_cache_; request lain seperti PUT/POST diteruskan langsung ke origin. Origin Access Identity (OAI) membatasi akses langsung ke origin S3. Signed URL digunakan untuk satu file, sedangkan Signed Cookie digunakan untuk banyak file sekaligus.

Pengaturan _geo-restriction_ hanya dapat memilih salah satu antara _blacklist_ atau _whitelist_, tidak keduanya. Proses _invalidation_ tidak dapat dibatalkan dan dikenakan biaya. Sebelum sebuah distribusi dapat dihapus, distribusi tersebut harus dinonaktifkan terlebih dahulu, yang memerlukan waktu sekitar 15 menit. Lambda@Edge memiliki empat titik eksekusi, yaitu pada _viewer request/response_ dan _origin request/response_.

### AWS Global Accelerator 🔴 _Prioritas Tinggi_

Layanan ini menyediakan dua alamat IP anycast statis yang tetap, bahkan ketika layanan dinonaktifkan. Health check mendukung protokol TCP, HTTP, dan HTTPS, namun tidak mendukung UDP, dengan waktu failover di bawah satu menit. Global Accelerator paling sesuai untuk traffic TCP/UDP non-HTTP — seperti gaming atau VoIP — yang membutuhkan IP statis, berbeda dengan CloudFront yang bekerja pada layer DNS dan caching konten.

### AWS Direct Connect 🟠 _Prioritas Sedang_

Direct Connect merupakan koneksi _dedicated_ menuju backbone AWS yang **tidak terenkripsi secara default**, dengan pilihan kecepatan port 1, 10, atau 100 Gbps.

| Virtual Interface (VIF) | Tujuan                                                       |
| ----------------------- | ------------------------------------------------------------ |
| **Public VIF**          | Mengakses layanan publik AWS (misalnya S3) melalui IP publik |
| **Private VIF**         | Mengakses satu VPC secara langsung melalui IP privat         |
| **Transit VIF**         | Mengakses banyak VPC sekaligus melalui Transit Gateway       |

Untuk mencapai _high availability_, dibutuhkan koneksi Direct Connect kedua atau VPN sebagai _backup_.

### AWS Site-to-Site VPN 🟠 _Prioritas Sedang_

Koneksi ini menggunakan IPsec melalui jaringan internet publik, menghubungkan Virtual Private Gateway (sisi AWS) dengan Customer Gateway (sisi on-premises), dan secara otomatis menyediakan dua tunnel. Routing dapat dikonfigurasi secara statis atau dinamis melalui BGP — BGP lebih disarankan karena memberikan resiliency yang lebih baik.

### AWS Transit Gateway 🟠 _Prioritas Sedang_

Transit Gateway menerapkan arsitektur _hub-and-spoke_ untuk menghubungkan banyak VPC, cukup dengan satu attachment per VPC — berbeda dengan VPC Peering yang bersifat _peer-to-peer_. CIDR pada VPC yang terhubung tidak boleh saling tumpang tindih, dan Transit Gateway mendukung peering antar region.

### VPC Flow Logs 🟠 _Prioritas Sedang_

Dapat diaktifkan pada level VPC, subnet, maupun ENI, dan dikirimkan ke CloudWatch Logs. Flow Logs tidak dapat diberi tag, tidak dapat dikonfigurasi ulang (harus dihapus dan dibuat kembali), serta tidak menangkap traffic Route 53, DHCP, metadata instance, Time Sync, maupun lisensi Windows.

### Amazon API Gateway ⚪ _Prioritas Rendah_

Endpoint wajib menggunakan HTTPS. Terdapat tiga tipe endpoint: Edge-Optimized, Regional, dan Private. Batas throttle default adalah 10.000 request/detik dengan 5.000 concurrent request — melebihi batas ini akan menghasilkan HTTP 429. Integrasi AWS_PROXY (menuju Lambda) merupakan yang paling umum digunakan, sementara integrasi MOCK digunakan untuk pengujian tanpa backend. Autentikasi dapat menggunakan IAM policy, Lambda authorizer, atau Cognito User Pools.

---

## 2. Storage

### Amazon S3 🔴 _Prioritas Tinggi_

#### Storage Class

| Storage Class                  | Durasi Minimum               | Waktu Retrieval             | Kapan Digunakan                                                                                             |
| ------------------------------ | ---------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Standard**                   | Tidak ada                    | Instan                      | Data yang sering diakses                                                                                    |
| **Intelligent-Tiering**        | Tidak ada                    | Instan                      | Pola akses tidak dapat diprediksi — perpindahan tier dilakukan otomatis                                     |
| **Standard-IA**                | 30 hari, minimum 128KB/objek | Instan                      | Jarang diakses namun membutuhkan akses cepat sewaktu-waktu                                                  |
| **One Zone-IA**                | 30 hari, minimum 128KB/objek | Instan                      | Serupa Standard-IA namun hanya disimpan pada satu Availability Zone (lebih murah, durabilitas lebih rendah) |
| **Glacier Instant Retrieval**  | 90 hari                      | Instan (hitungan milidetik) | Arsip yang jarang diakses namun sesekali membutuhkan akses instan                                           |
| **Glacier Flexible Retrieval** | 90 hari                      | Hitungan menit hingga jam   | Arsip dengan waktu retrieval yang masih relatif cepat                                                       |
| **Glacier Deep Archive**       | 180 hari                     | Hingga 12 jam               | Arsip jangka sangat panjang, paling murah, waktu retrieval paling lambat                                    |

Beberapa karakteristik penting S3 lainnya:

- Model konsistensi _read-after-write_ berlaku untuk objek baru (PUT), sementara _eventual consistency_ berlaku pada operasi overwrite atau delete.
- _Versioning_, setelah diaktifkan, tidak dapat dinonaktifkan sepenuhnya — hanya dapat disuspensi. Cross-Region Replication mewajibkan versioning aktif di kedua bucket.
- _Multipart upload_ diwajibkan untuk objek berukuran di atas 5GB. Batas default adalah 100 bucket per akun.
- **S3 Event Notification** memicu aksi otomatis (Lambda, SQS, atau SNS) ketika terjadi event pada bucket, tanpa memerlukan polling manual. Untuk kebutuhan routing yang lebih kompleks, notifikasi dapat diarahkan terlebih dahulu ke **EventBridge**.
- **S3 Transfer Acceleration** mempercepat transfer data jarak jauh — baik unggah maupun unduh — dengan memanfaatkan CloudFront Edge Locations. Sebagian besar skenario soal berfokus pada proses unggah data berukuran besar dari lokasi yang jauh, meski proses unduh turut dipercepat.
- **S3 Object Lock** ⚠️ menerapkan mekanisme WORM (_Write Once Read Many_) yang mencegah objek dihapus atau ditimpa hingga periode tertentu terlampaui, dengan dua mode: _Governance_ (masih dapat di-_override_ oleh user tertentu) dan _Compliance_ (tidak dapat diubah oleh siapa pun, termasuk root user). _(Topik ini tidak dibahas pada cheat sheet Neal Davis, dan ditambahkan berdasarkan dokumentasi resmi AWS.)_

#### Jenis Enkripsi S3

| Jenis                      | Pemegang Key Enkripsi                                                | Karakteristik                                                                                                                      |
| -------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **SSE-S3**                 | AWS (key unik per objek)                                             | Metode default, tanpa biaya tambahan, menggunakan AES-256, key dirotasi otomatis oleh AWS                                          |
| **SSE-KMS**                | AWS KMS (Customer Master Key)                                        | Menyediakan audit trail melalui CloudTrail, permission dapat diatur terpisah melalui key policy — dikenakan biaya tambahan         |
| **SSE-C**                  | Customer (key dikirimkan langsung oleh pengguna pada setiap request) | AWS hanya memproses enkripsi tanpa menyimpan key — kehilangan key berarti kehilangan akses data secara permanen                    |
| **Client-Side Encryption** | Customer (enkripsi dilakukan sebelum data dikirim ke S3)             | S3 hanya menyimpan data yang sudah terenkripsi sebelumnya, baik menggunakan CMK dari KMS maupun key yang dikelola aplikasi sendiri |

Cara mudah membedakannya: awalan "SSE" berarti _Server-Side Encryption_, di mana proses enkripsi dilakukan oleh S3. Selain itu, khusus pada SSE-C dan Client-Side Encryption, AWS **sama sekali tidak menyimpan key** milik pengguna.

### Amazon EBS 🔴 _Prioritas Tinggi_

#### Jenis Volume

| Jenis       | Tipe                                    | IOPS Maksimum | Karakteristik                                                                                                                                                             |
| ----------- | --------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **gp2**     | SSD, general purpose                    | 16.000        | IOPS mengikuti ukuran volume (3 IOPS/GB), dapat _burst_ menggunakan credit                                                                                                |
| **gp3**     | SSD, general purpose (generasi terbaru) | 16.000        | Baseline IOPS (3.000) dan throughput (125 MiB/s) bersifat tetap, tidak bergantung pada ukuran volume — dapat ditingkatkan secara independen dan lebih murah dibanding gp2 |
| **io1/io2** | SSD, provisioned IOPS                   | 64.000        | Ditujukan untuk kebutuhan IOPS tinggi dan konsisten (misalnya database besar), mendukung _Multi-Attach_                                                                   |
| **st1**     | HDD, throughput optimized               | —             | Untuk big data/log processing, biaya rendah, tidak dapat digunakan sebagai boot volume                                                                                    |
| **sc1**     | HDD, cold storage                       | —             | Untuk data yang jarang diakses, biaya paling rendah, tidak dapat digunakan sebagai boot volume                                                                            |

Peralihan dari gp2 ke gp3 pada dasarnya merupakan peningkatan yang menawarkan performa lebih terjamin dengan biaya lebih rendah. Ketika sebuah soal menyebutkan kebutuhan "performa lebih baik dengan biaya lebih rendah", jawaban yang tepat hampir selalu **gp3**, bukan io1/io2.

Volume EBS bersifat spesifik terhadap satu Availability Zone, sementara snapshot bersifat spesifik terhadap region (disimpan di S3 secara incremental). Instance Store bersifat non-persistent dan mengharuskan instance tetap berjalan, sedangkan EBS bersifat persistent dan mendukung instance yang dihentikan sementara (_stop_).

### Amazon EFS 🔴 _Prioritas Tinggi_

EFS menggunakan protokol NFS, mendukung akses multi-AZ, dan dapat diakses oleh ribuan instance EC2 secara bersamaan — berbeda dengan EBS yang hanya dapat digunakan satu instance dalam satu waktu. Terdapat dua performance mode (General Purpose dan Max I/O) serta dua throughput mode (Bursting dan Provisioned). Enkripsi at-rest harus diaktifkan sejak filesystem pertama kali dibuat, dan tidak dapat ditambahkan kemudian.

### Amazon FSx 🔴 _Prioritas Tinggi_

| Jenis                   | Protokol               | Kapan Digunakan                                                                                  |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------ |
| **Windows File Server** | SMB + Active Directory | Aplikasi berbasis Windows yang membutuhkan shared file storage native                            |
| **Lustre — Scratch**    | POSIX, HPC             | Komputasi HPC/ML bersifat sementara, tanpa high availability                                     |
| **Lustre — Persistent** | POSIX, HPC             | Komputasi HPC/ML jangka panjang, high availability pada single-AZ, terintegrasi native dengan S3 |

### AWS Storage Gateway 🔴 _Prioritas Tinggi_

Storage Gateway merupakan solusi hybrid: aplikasi atau infrastruktur di lingkungan on-premises tidak perlu diubah sama sekali — sistem tetap "mengira" sedang berkomunikasi dengan storage lokal biasa — sementara di baliknya, data sesungguhnya disimpan di Amazon S3, dengan penyimpanan cache lokal untuk data yang sering diakses.

| Jenis Gateway               | Interface                  | Karakteristik                                                              |
| --------------------------- | -------------------------- | -------------------------------------------------------------------------- |
| **File Gateway**            | NFS/SMB menuju S3          | Ukuran file maksimum 5TB, diakses layaknya file share biasa                |
| **Volume Gateway — Cached** | iSCSI                      | Data utama disimpan di S3, cache lokal untuk data yang sering diakses      |
| **Volume Gateway — Stored** | iSCSI                      | Data utama tetap di on-premises, S3 digunakan untuk backup secara asinkron |
| **Tape Gateway**            | Virtual Tape Library (VTL) | Pengganti tape fisik untuk software backup seperti NetBackup atau Veeam    |

Satu gateway hanya dapat menjalankan satu jenis interface dalam satu waktu, dan tidak dapat dicampur.

### AWS DataSync 🔴 _Prioritas Tinggi_

DataSync melakukan transfer data secara online melalui jaringan — berbeda dengan Snow Family yang melakukan transfer secara fisik. Layanan ini memerlukan DataSync Agent (berbentuk virtual machine) di lingkungan on-premises, dengan tujuan transfer berupa S3 (seluruh storage class), EFS, atau FSx for Windows File Server.

### AWS Snow Family 🟠 _Prioritas Sedang_

| Anggota             | Skala                | Karakteristik                                                                   |
| ------------------- | -------------------- | ------------------------------------------------------------------------------- |
| **Snowcone**        | Puluhan TB           | Perangkat edge terkecil dan portable, dapat pula digunakan untuk edge computing |
| **Snowball (Edge)** | Ratusan TB hingga PB | Transfer fisik dalam jumlah besar, enkripsi menggunakan KMS                     |
| **Snowmobile**      | Hingga 100PB         | Berbentuk truk kontainer, untuk migrasi data center berskala eksabyte           |

Snow Family dipilih ketimbang DataSync ketika bandwidth jaringan yang tersedia tidak memadai untuk volume data yang sangat besar dalam batas waktu yang ditentukan.

### AWS Backup 🟠 _Prioritas Sedang_

Menyediakan backup terpusat untuk EC2, EBS, EFS, FSx, S3, RDS, DynamoDB, dan Storage Gateway. Fitur _Vault Lock_ mencegah penghapusan atau modifikasi backup, dan terintegrasi dengan AWS Organizations untuk kebutuhan multi-akun.

---

## 3. Security, Identity & Compliance

### AWS IAM 🔴 _Prioritas Tinggi_

Urutan evaluasi policy pada IAM: seluruh request bersifat _implicit deny_ secara default, kemudian _explicit allow_ dapat membatalkannya, namun tetap dibatasi oleh permission boundary, SCP, dan session policy — dan _explicit deny_ di lapisan mana pun akan selalu menang. Perlu diperhatikan bahwa hasil akhir permission merupakan **irisan (intersection)**, bukan gabungan (union), dari seluruh policy yang berlaku.

#### Membedakan Konsep-Konsep IAM

Salah satu bagian yang paling sering membingungkan adalah perbedaan istilah-istilah dalam IAM. Berikut rangkumannya:

| Konsep                           | Definisi                                                                                                         | Poin Penting                                                                                                                             |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **IAM User**                     | Identitas untuk satu individu atau aplikasi, memiliki kredensial permanen (password dan/atau access key)         | Maksimum dua access key aktif per user; maksimum 5.000 user per akun                                                                     |
| **IAM Group**                    | Kumpulan IAM User untuk memudahkan pemberian permission secara massal                                            | Bukan merupakan _principal_ — tidak dapat menjadi subjek dalam sebuah policy; tidak dapat bersifat nested                                |
| **IAM Role**                     | Identitas tanpa kredensial permanen, digunakan ("_assumed_") secara sementara oleh user, service, atau akun lain | Tidak memiliki password atau access key sendiri; satu instance EC2 hanya dapat menggunakan satu role dalam satu waktu                    |
| **IAM Policy (identity-based)**  | Dokumen JSON berisi izin yang dilekatkan pada User, Group, atau Role                                             | Terdapat tiga jenis: AWS Managed, Customer Managed, dan Inline                                                                           |
| **Resource-based Policy**        | Policy yang dilekatkan langsung pada resource, bukan pada identitas — misalnya S3 bucket policy                  | Umum digunakan untuk kebutuhan cross-account access tanpa proses _assume role_                                                           |
| **Trust Policy**                 | Bagian dari IAM Role yang menentukan **siapa** yang diizinkan melakukan _assume_ terhadap role tersebut          | Berbeda dari _permissions policy_ yang menentukan **apa** yang boleh dilakukan oleh role; wildcard tidak diperbolehkan sebagai principal |
| **Permission Boundary**          | Batas maksimum permission untuk satu identitas tertentu                                                          | Tidak memberikan izin secara langsung, hanya membatasi izin yang sudah ada                                                               |
| **Service Control Policy (SCP)** | Batas maksimum permission pada level akun atau Organizational Unit                                               | Serupa dengan permission boundary, namun berlaku di level akun; tidak berlaku pada management account                                    |

Cara paling praktis membedakan Role dengan User: apabila sebuah soal menyebutkan istilah "_temporary credentials_", "_assume_", "_cross-account access_", atau "aplikasi pada EC2/Lambda membutuhkan akses ke layanan AWS lain", jawaban yang tepat adalah **IAM Role**, bukan IAM User atau access key. Sementara itu, cara membedakan Trust Policy dengan Permissions Policy: Trust Policy menjawab pertanyaan "siapa yang boleh menggunakan role ini", sedangkan Permissions Policy menjawab "apa yang boleh dilakukan oleh role ini".

### AWS Organizations 🔴 _Prioritas Tinggi_

Service Control Policy (SCP) berfungsi sebagai _guardrail_ atau pembatas maksimum, dan **tidak pernah memberikan izin** secara mandiri — hasil akhir permission tetap merupakan irisan antara SCP dan IAM policy. SCP tidak berlaku pada management account maupun service-linked role. Batas default untuk _consolidated billing_ adalah 20 akun tertaut.

### IAM Identity Center (AWS SSO) 🔴 _Prioritas Tinggi_

Menyediakan single sign-on terpusat lintas berbagai akun dalam Organizations, termasuk aplikasi SaaS pihak ketiga melalui SAML 2.0, tanpa perlu membuat IAM user terpisah pada setiap akun.

### AWS KMS 🔴 _Prioritas Tinggi_

Enkripsi langsung dibatasi hingga 4KB, sehingga digunakan pendekatan _Envelope Encryption_: KMS mengenkripsi _Data Encryption Key_ (DEK), yang kemudian digunakan untuk mengenkripsi data sesungguhnya. DEK tidak pernah disimpan oleh KMS.

| Jenis Key                | Biaya    | Kontrol Rotasi/Policy                                                                     |
| ------------------------ | -------- | ----------------------------------------------------------------------------------------- |
| **AWS Managed Key**      | Gratis   | Sepenuhnya dikelola oleh AWS                                                              |
| **Customer Managed Key** | Berbayar | Kontrol penuh atas rotasi, policy, dan penonaktifan oleh pengguna                         |
| **AWS Owned Key**        | Gratis   | Tidak terlihat maupun dikelola oleh pelanggan, digunakan secara internal oleh layanan AWS |

Key bersifat regional. Proses penghapusan key memerlukan masa tunggu 7 hingga 30 hari. Akses non-root memerlukan key policy dan IAM policy secara bersamaan.

### AWS CloudTrail 🔴 _Prioritas Tinggi_

CloudTrail aktif secara otomatis sejak sebuah akun AWS dibuat, menyediakan riwayat _Event History_ selama 90 hari melalui console/API tanpa memerlukan konfigurasi tambahan — namun pada kondisi ini belum ada tujuan ekspor mana pun. Ketika sebuah Trail dibuat, tujuan wajibnya adalah **Amazon S3 bucket**; secara opsional, log juga dapat dikirimkan ke CloudWatch Logs untuk mendukung _alarming_ secara real-time. CloudTrail merekam "siapa melakukan API call apa", sedangkan CloudWatch merekam "bagaimana performa sistem" — keduanya kerap dianggap serupa meski fungsinya berbeda.

### Amazon Cognito 🟠 _Prioritas Sedang_

User Pools berfungsi untuk autentikasi (menyerupai IAM User), menghasilkan JWT. Identity Pools berfungsi untuk otorisasi (menyerupai IAM Role), menghasilkan kredensial AWS sementara melalui STS.

### AWS WAF & Shield 🟠 _Prioritas Sedang_

WAF beroperasi pada layer 7, memfilter serangan seperti SQL injection dan XSS, terintegrasi dengan CloudFront maupun ALB. Shield beroperasi pada layer 3/4, menangani serangan DDoS volumetrik. Shield Standard tersedia gratis dan otomatis untuk seluruh akun, sedangkan Shield Advanced berbayar dan mencakup akses ke DDoS Response Team (DRT) selama 24/7.

### AWS Config 🟠 _Prioritas Sedang_

Merekam snapshot konfigurasi resource beserta pemeriksaan kepatuhan (Config Rules) — berbeda dari CloudTrail yang berfokus pada audit API call.

### AWS Secrets Manager 🟠 _Prioritas Sedang_

Menyediakan rotasi kredensial otomatis untuk RDS, Redshift, dan DocumentDB (berbayar), berbeda dengan SSM Parameter Store yang tidak memiliki rotasi native namun tersedia secara gratis pada tier standar dan mendukung struktur hierarkis.

### Beberapa Layanan Keamanan Tambahan ⚪ _Prioritas Rendah_

- **AWS Resource Access Manager (RAM)**: berbagi resource (subnet, Transit Gateway, License Manager) lintas akun tanpa duplikasi.
- **Amazon Macie** ⚠️: layanan machine learning yang secara otomatis menemukan dan melindungi data sensitif (PII, data finansial) yang tersimpan di S3. _(Tidak dibahas pada cheat sheet Neal Davis, ditambahkan dari dokumentasi AWS.)_
- **AWS Security Hub** ⚠️: dashboard terpusat yang mengagregasi temuan dari GuardDuty, Inspector, Macie, dan Config — bukan mesin deteksi tersendiri. _(Ditambahkan dari dokumentasi AWS.)_
- **AWS Firewall Manager** ⚠️: mengelola rule WAF, Shield Advanced, dan Security Group secara terpusat di seluruh akun dalam Organizations. _(Ditambahkan dari dokumentasi AWS.)_
- **AWS CloudHSM**: hardware security module _single-tenant_ yang memenuhi standar FIPS 140-2 Level 3, berbeda dengan KMS yang bersifat _multi-tenant_ dan terkelola sepenuhnya oleh AWS.
- **AWS Certificate Manager (ACM)**: sertifikat SSL/TLS gratis dengan perpanjangan otomatis, namun hanya berlaku untuk resource AWS yang terintegrasi (ELB, CloudFront) — private key tidak dapat diunduh.
- **AWS GuardDuty**: mendeteksi ancaman berdasarkan analisis CloudTrail, VPC Flow Logs, dan DNS logs.
- **AWS Trusted Advisor**: menyediakan pemeriksaan berdasarkan lima kategori; tier gratis hanya mencakup tujuh pemeriksaan inti.
- **Amazon Inspector**: melakukan penilaian kerentanan (vulnerability/CVE assessment) terhadap resource yang sedang berjalan.
- **AWS Directory Service**: tersedia dalam tiga varian — AWS Managed Microsoft AD (Active Directory penuh), Simple AD (berbasis Samba, murah, kapasitas terbatas), dan AD Connector (proxy menuju Active Directory on-premises tanpa duplikasi user).

#### Merangkum Keluarga Layanan Keamanan & Kepatuhan

| Layanan             | Fungsi Utama                                              | Kapan Aktif                           |
| ------------------- | --------------------------------------------------------- | ------------------------------------- |
| **WAF**             | Memfilter serangan layer 7 pada traffic HTTP/HTTPS        | Memerlukan konfigurasi manual         |
| **Shield Standard** | Proteksi DDoS layer 3/4                                   | Aktif otomatis dan gratis             |
| **Shield Advanced** | Proteksi DDoS tingkat lanjut, termasuk akses DRT          | Berbayar, memerlukan subscription     |
| **GuardDuty**       | Deteksi ancaman berdasarkan analisis log secara real-time | Perlu diaktifkan, tanpa agent         |
| **Inspector**       | Penilaian kerentanan pada resource yang sudah berjalan    | Perlu diaktifkan, pemeriksaan berkala |
| **Trusted Advisor** | Rekomendasi praktik terbaik secara umum                   | Tier gratis terbatas                  |
| **Config**          | Snapshot dan kepatuhan konfigurasi resource               | Perlu diaktifkan                      |
| **CloudTrail**      | Audit aktivitas API                                       | Aktif otomatis                        |

Secara konseptual: WAF dan Shield bersifat **preventif**, mencegah serangan sebelum mencapai sistem. GuardDuty dan Inspector bersifat **detektif**, mengidentifikasi masalah setelah atau selama sistem berjalan. Trusted Advisor memberikan rekomendasi umum, bukan proteksi maupun deteksi ancaman yang spesifik.

---

## 4. Compute

### Amazon EC2 🔴 _Prioritas Tinggi_

#### Purchasing Options

Topik ini merupakan salah satu yang paling sering diujikan, biasanya dalam konteks skenario "solusi paling hemat biaya".

| Opsi                                | Komitmen                 | Diskon                                 | Karakteristik                                                                                 |
| ----------------------------------- | ------------------------ | -------------------------------------- | --------------------------------------------------------------------------------------------- |
| **On-Demand**                       | Tidak ada                | Tidak ada                              | Dibayar per jam/detik, paling fleksibel                                                       |
| **Spot Instance**                   | Tidak ada                | Hingga 90%                             | Dapat diinterupsi (notifikasi dua menit sebelumnya), cocok untuk workload yang fault-tolerant |
| **Reserved Instance — Standard**    | 1 atau 3 tahun           | 40–60%                                 | Dapat mengubah AZ/ukuran, namun tidak dapat mengubah instance family                          |
| **Reserved Instance — Convertible** | 1 atau 3 tahun           | 31–54%                                 | Dapat ditukar ke instance family, OS, atau tenancy lain                                       |
| **Reserved Instance — Scheduled**   | 1 tahun, jadwal berulang | —                                      | Untuk kebutuhan yang dapat diprediksi namun tidak berjalan 24/7                               |
| **Savings Plan — Compute** ⚠️       | 1 atau 3 tahun           | Hingga 66%                             | Paling fleksibel — berlaku lintas instance family, region, OS, bahkan hingga Fargate/Lambda   |
| **Savings Plan — EC2 Instance** ⚠️  | 1 atau 3 tahun           | Lebih tinggi dari Compute Savings Plan | Terikat pada satu instance family di satu region                                              |
| **Dedicated Host**                  | Opsional                 | —                                      | Server fisik eksklusif dengan kontrol penuh atas socket/core/host ID                          |
| **Dedicated Instance**              | Tidak ada                | —                                      | Tenancy eksklusif namun tetap tervirtualisasi                                                 |

_(Topik Savings Plans tidak dibahas secara eksplisit pada cheat sheet Neal Davis, dan ditambahkan berdasarkan dokumentasi resmi AWS mengingat topik ini cukup sering muncul dalam soal terkait optimasi biaya.)_

Sebagai panduan umum: workload yang fleksibel dan dapat diinterupsi paling sesuai menggunakan Spot Instance. Workload yang stabil dalam jangka panjang namun berpotensi berpindah instance family atau region lebih sesuai menggunakan Compute Savings Plan. Sementara workload yang stabil dengan instance family yang sudah pasti tidak berubah dapat memanfaatkan Reserved Instance atau EC2 Instance Savings Plan untuk mendapatkan diskon yang lebih besar.

Beberapa poin tambahan: Placement Group tersedia dalam tiga jenis — Cluster (satu AZ, latency rendah), Spread (lintas AZ), dan Partition (rack terpisah). Elastic IP tersedia lima per region secara default; alamat IP publik akan hilang saat instance dihentikan, sementara Elastic IP tetap.

### Amazon EC2 Auto Scaling 🔴 _Prioritas Tinggi_

| Launch Template vs Configuration | Karakteristik                                                                                             |
| -------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **Launch Template**              | Mendukung _versioning_, dapat diperbarui tanpa membuat konfigurasi baru — direkomendasikan                |
| **Launch Configuration**         | Bersifat _immutable_, harus dibuat ulang setiap kali terdapat perubahan — sudah tergolong lama (_legacy_) |

| Scaling Policy      | Cara Kerja                                                                                                                              |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **Target Tracking** | Menetapkan target metric tertentu, Auto Scaling Group menyesuaikan jumlah instance secara otomatis — direkomendasikan, paling sederhana |
| **Step Scaling**    | Penyesuaian bertahap berdasarkan besarnya pelanggaran terhadap alarm threshold                                                          |
| **Simple Scaling**  | Satu aksi scaling per alarm, harus menunggu masa _cooldown_ sebelum aksi berikutnya                                                     |

### Amazon ECS, AWS Fargate, dan Amazon EKS 🔴 _Prioritas Tinggi_

|                              | ECS                                  | EKS                                  | Fargate                                     |
| ---------------------------- | ------------------------------------ | ------------------------------------ | ------------------------------------------- |
| Orchestrator                 | Proprietary AWS (istilah "Task")     | Kubernetes (istilah "Pod")           | Bukan orchestrator — merupakan mode compute |
| Launch type                  | EC2 atau Fargate                     | EC2 atau Fargate                     | —                                           |
| Kontrol level OS             | Ya, pada launch type EC2             | Ya, pada launch type EC2             | Tidak ada (serverless)                      |
| Kompatibilitas multi-cloud   | Tidak, bersifat proprietary AWS      | Ya, mengikuti standar Kubernetes     | —                                           |
| Perlu mengelola EC2/patching | Ya, jika menggunakan launch type EC2 | Ya, jika menggunakan launch type EC2 | Tidak diperlukan sama sekali                |

Perlu dipahami bahwa Fargate bukan pesaing dari ECS maupun EKS, melainkan merupakan pilihan _launch type_ di dalam keduanya — alternatif dari launch type EC2 yang membebaskan pengguna dari kebutuhan mengelola infrastruktur secara langsung.

### AWS Lambda 🟠 _Prioritas Sedang_

Alokasi memory berkisar antara 128MB hingga 10.240MB, dengan timeout maksimum 900 detik. Terdapat dua mode invoke: _synchronous_ (menunggu hasil) dan _asynchronous_ (retry dua kali, kemudian diarahkan ke DLQ/Destination). Reserved Concurrency menjamin kapasitas eksekusi, sedangkan Provisioned Concurrency menjaga fungsi tetap "hangat" untuk menghindari _cold start_.

Lambda sebaiknya **dihindari** ketika sebuah soal menyebutkan kebutuhan _long-running task_ yang berat (lebih dari 15 menit, batch processing, atau video encoding berskala besar) — dalam kasus tersebut, EC2, ECS, Fargate, atau AWS Batch lebih sesuai. Sebaliknya, Lambda **paling sesuai** ketika soal menyebutkan microservices, fungsi berdurasi pendek, atau trigger berbasis event (S3, API Gateway, EventBridge).

### AWS Batch 🟠 _Prioritas Sedang_ ⚠️

_(Layanan ini tidak dibahas pada cheat sheet Neal Davis, ditambahkan berdasarkan dokumentasi AWS karena cukup sering muncul sebagai jawaban yang tepat dalam soal-soal latihan.)_

AWS Batch merupakan layanan _managed batch computing_ yang memungkinkan eksekusi ratusan hingga ribuan job komputasi tanpa perlu mengelola cluster atau scheduler secara manual — kapasitas compute (EC2 atau Fargate) disediakan secara otomatis sesuai kebutuhan job, kemudian dihentikan setelah selesai. Layanan ini paling sesuai untuk job komputasi berat berdurasi lama yang perlu dimulai kembali dari awal apabila terinterupsi.

### AWS Elastic Beanstalk ⚪ _Prioritas Rendah_

| Deployment Policy                 | Downtime                                                                  | Rollback                 |
| --------------------------------- | ------------------------------------------------------------------------- | ------------------------ |
| **All at Once**                   | Ada                                                                       | Sulit dilakukan          |
| **Rolling**                       | Tidak ada, kapasitas berkurang sementara                                  | Manual, per batch        |
| **Rolling with additional batch** | Tidak ada, kapasitas tetap terjaga                                        | Manual                   |
| **Immutable**                     | Tidak ada — instance baru dibuat penuh sebelum di-_swap_                  | Paling aman              |
| **Blue/Green**                    | Tidak ada — environment baru dibuat penuh, kemudian di-_swap_ melalui DNS | Paling aman dan tercepat |

---

## 5. Database

### Amazon RDS 🔴 _Prioritas Tinggi_

Mendukung enam engine (Aurora, MySQL, MariaDB, Oracle, SQL Server, PostgreSQL) dengan kapasitas maksimum 64TiB (16TiB untuk SQL Server).

| Aspek           | Multi-AZ                                             | Read Replica                           |
| --------------- | ---------------------------------------------------- | -------------------------------------- |
| Tujuan          | High Availability                                    | Scaling untuk read traffic             |
| Replikasi       | Sinkron                                              | Asinkron                               |
| Dapat dibaca?   | Tidak, secondary tidak dapat diakses untuk pembacaan | Ya                                     |
| Jumlah maksimum | Satu standby                                         | Lima                                   |
| Failover        | Otomatis                                             | Manual (promosi menjadi DB independen) |

### Amazon Aurora 🔴 _Prioritas Tinggi_

Menyimpan enam salinan data pada tiga Availability Zone — proses penulisan tetap berjalan meski kehilangan dua salinan, dan proses pembacaan tetap berjalan meski kehilangan tiga salinan. Aurora Replica mendukung hingga 15 replica dengan failover otomatis dan latency dalam hitungan milidetik, dibandingkan MySQL Replica yang hanya mendukung lima replica dengan failover manual.

**Aurora Serverless** menyediakan penyesuaian kapasitas compute secara otomatis berdasarkan permintaan, dengan biaya dihitung per detik pemakaian — sangat sesuai untuk beban kerja yang bersifat variabel atau sulit diprediksi.

**RDS Proxy** ⚠️ menyediakan _connection pooling_ terkelola di depan RDS/Aurora, mencegah terjadinya "connection storm" dari aplikasi serverless seperti Lambda yang membuka banyak koneksi database secara bersamaan. _(Topik ini ditambahkan berdasarkan dokumentasi AWS.)_

### Amazon DynamoDB 🔴 _Prioritas Tinggi_

| Aspek                    | Local Secondary Index (LSI)   | Global Secondary Index (GSI)            |
| ------------------------ | ----------------------------- | --------------------------------------- |
| Kapan dibuat             | Hanya saat table dibuat       | Kapan saja                              |
| Partition key            | Harus sama dengan table utama | Dapat berbeda                           |
| Kapasitas                | Berbagi dengan table utama    | Terpisah                                |
| Jumlah maksimum          | 5                             | 20 (default AWS, dapat ditingkatkan) ⚠️ |
| Strongly consistent read | Tersedia                      | Tidak tersedia                          |

_(Angka "maksimum 20 GSI" merupakan batas default dari dokumentasi AWS, bukan disebutkan secara eksplisit pada cheat sheet Neal Davis.)_

Mode kapasitas tersedia dalam dua pilihan: Provisioned (RCU/WCU diatur manual atau auto-scale) dan On-Demand (dibayar per request, dengan batas perpindahan mode maksimum satu kali per hari). DAX menyediakan _cache_ khusus untuk operasi baca dengan percepatan hingga sepuluh kali lipat. **DynamoDB Streams** mencatat perubahan data secara berurutan berdasarkan waktu dan umum digunakan sebagai event source bagi Lambda. **Global Tables** menyediakan replikasi multi-region dan multi-master secara terkelola penuh, namun **tidak mendukung strongly consistent read lintas region** — ini merupakan jebakan klasik yang sering muncul di ujian.

### Amazon Redshift ⚪ _Prioritas Rendah_

Merupakan data warehouse yang dirancang untuk beban kerja **OLAP**, bukan OLTP. Deployment hanya tersedia dalam konfigurasi single-AZ. Redshift Spectrum memungkinkan query langsung terhadap data di S3 tanpa perlu memuatnya ke cluster terlebih dahulu.

### Amazon ElastiCache ⚪ _Prioritas Rendah_

| Aspek                | Redis                                  | Memcached                                                      |
| -------------------- | -------------------------------------- | -------------------------------------------------------------- |
| Persistence          | Ya                                     | Tidak                                                          |
| Replikasi & Multi-AZ | Ya                                     | Tidak                                                          |
| Enkripsi             | Ya                                     | Tidak                                                          |
| Arsitektur           | Single-threaded, scaling melalui shard | Multi-threaded, scaling melalui node, mendukung auto-discovery |
| Apabila node gagal   | Tersedia failover (Multi-AZ)           | Data hilang, tanpa replikasi                                   |

---

## 6. Management Tools

### AWS Systems Manager 🔴 _Prioritas Tinggi_

**Session Manager** berfungsi sebagai pengganti bastion host/SSH tradisional, tanpa perlu membuka port 22, dengan autentikasi melalui IAM. **Parameter Store** tersedia dalam tier Standard (gratis) dan Advanced (berbayar). **Patch Manager** menggunakan konsep _patch baseline_ untuk mengelola pembaruan sistem.

### Amazon CloudWatch 🔴 _Prioritas Tinggi_

Retensi metric perlu dihafalkan: metric dengan resolusi di bawah 60 detik disimpan selama 3 jam; resolusi 60 detik disimpan 15 hari; resolusi 300 detik disimpan 63 hari; dan resolusi 3600 detik disimpan hingga 455 hari. Alarm hanya ter-trigger pada perubahan _state_ yang bersifat bertahan (_sustained_), bukan lonjakan sesaat.

Terdapat dua metode untuk "mengeluarkan" data dari CloudWatch Logs, dan keduanya sering tertukar:

- **Export ke S3** (`CreateExportTask`) bersifat _batch_, bukan real-time, dengan potensi keterlambatan hingga 21 jam — sesuai untuk kebutuhan arsip.
- **Subscription Filter** bersifat real-time, mengirimkan log secara streaming menuju Kinesis Data Streams, Kinesis Data Firehose, atau Lambda — pilihan yang tepat ketika soal menyebutkan kebutuhan "tercepat" atau "real-time".

### AWS Cost Management ⚪ _Prioritas Rendah_

| Tool                          | Fungsi                                                                     |
| ----------------------------- | -------------------------------------------------------------------------- |
| **Cost Explorer**             | Visualisasi biaya, data historis 13 bulan, forecast 3 bulan ke depan       |
| **Cost & Usage Report (CUR)** | Laporan tagihan paling detail, dipublikasikan ke S3                        |
| **AWS Budgets**               | Penetapan anggaran disertai notifikasi otomatis saat melewati ambang batas |

### Layanan Manajemen Lainnya ⚪ _Prioritas Rendah_

- **AWS CloudFormation**: Infrastructure as Code berbasis template JSON/YAML. StackSets memungkinkan deploy lintas akun dan region.
- **AWS OpsWorks**: configuration management berbasis Chef/Puppet.
- **AWS Service Catalog** ⚠️: katalog produk IT (template CloudFormation yang telah disetujui) yang dapat digunakan secara self-service oleh user lain tanpa akses penuh ke resource AWS — berguna untuk kebutuhan _governance_. _(Ditambahkan berdasarkan dokumentasi AWS.)_

---

## 7. Analytics & Big Data

Seluruh layanan pada kategori ini termasuk prioritas rendah (⚪) menurut sumber utama.

### Amazon Athena

Layanan serverless untuk menjalankan query SQL langsung terhadap data di S3, dengan biaya dihitung berdasarkan jumlah data yang di-_scan_.

### Amazon Kinesis

| Aspek             | Data Streams                            | Firehose                                              |
| ----------------- | --------------------------------------- | ----------------------------------------------------- |
| Model             | Berbasis shard                          | Tanpa shard, auto-scale                               |
| Retensi & replay  | 24 jam hingga 7 hari, dapat di-_replay_ | Tidak ada retensi, langsung dikirim ke tujuan         |
| Konsumen          | Custom (KCL/Lambda)                     | Tetap: S3, Redshift, OpenSearch Service, atau Splunk  |
| Transformasi data | Dilakukan manual di sisi consumer       | Tersedia built-in melalui Lambda sebelum data dikirim |

### AWS Glue

Layanan ETL serverless yang juga menyediakan Data Catalog, digunakan bersama Athena, Redshift Spectrum, maupun EMR — bukan merupakan query engine.

### Amazon OpenSearch Service

Layanan pencarian dan analitik log berbasis Elasticsearch. Domain yang sudah dibuat tidak dapat dipindahkan antara konfigurasi VPC dan publik.

### Amazon QuickSight ⚠️

Layanan Business Intelligence yang bersifat serverless, digunakan untuk membangun dashboard dan visualisasi interaktif dari berbagai sumber data. _(Ditambahkan berdasarkan dokumentasi AWS mengingat cukup sering muncul sebagai jawaban yang tepat dalam soal latihan.)_

---

## 8. Application Integration & Migration

### SQS, SNS, EventBridge, dan Step Functions

| Layanan            | Model           | Karakteristik                                                                                                                                  |
| ------------------ | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **SQS**            | Pull (antrean)  | Retensi default 4 hari (maksimum 14). Standard mendukung throughput tanpa batas namun berpotensi duplikat; FIFO menjamin urutan tanpa duplikat |
| **SNS**            | Push (pub/sub)  | Mendukung _fan-out_ ke banyak subscriber sekaligus                                                                                             |
| **EventBridge**    | Push, event bus | Menerima event dari berbagai sumber (AWS, SaaS, aplikasi sendiri), melakukan routing berdasarkan rule yang mencocokkan isi event               |
| **Step Functions** | Orkestrasi      | Mengelola workflow multi-tahap dengan biaya dihitung per _state transition_                                                                    |

Salah satu pola yang sering diujikan: ketika sebuah soal menyebutkan kebutuhan mengirimkan satu event ke banyak sistem sekaligus, jawaban yang tepat adalah pola _fan-out_ dari SNS menuju banyak SQS queue — bukan sebaliknya.

### AWS Migration Services

AWS Database Migration Service (DMS) digunakan untuk migrasi database dengan downtime minimal. AWS Elastic Transcoder digunakan untuk transcoding video/audio berbasis S3, dan tidak ditujukan untuk kebutuhan live streaming.

---

## 9. Artificial Intelligence & Machine Learning

Seluruh layanan berikut menyediakan model _pre-trained_ yang siap digunakan melalui API — berbeda dengan Amazon SageMaker yang ditujukan untuk membangun model machine learning sendiri.

| Kebutuhan                                   | Layanan            |
| ------------------------------------------- | ------------------ |
| Analisis gambar/video                       | Amazon Rekognition |
| Ekstraksi data dari dokumen (form, invoice) | Amazon Textract    |
| Konversi suara menjadi teks                 | Amazon Transcribe  |
| Konversi teks menjadi suara                 | Amazon Polly       |
| Penerjemahan bahasa                         | Amazon Translate   |
| Analisis sentimen dan NLP                   | Amazon Comprehend  |
| Chatbot dan voice bot                       | Amazon Lex         |
| Membangun dan melatih model ML sendiri      | Amazon SageMaker   |
| Prediksi time-series                        | Amazon Forecast    |
| Deteksi anomali operasional                 | Amazon DevOps Guru |
| Integrasi data SaaS dengan AWS              | AWS AppFlow        |

---

## 10. Strategi Disaster Recovery

_(Topik ini tidak dibahas secara eksplisit pada cheat sheet Neal Davis manapun yang menjadi sumber utama rangkuman ini, dan disusun berdasarkan AWS Well-Architected Framework serta dokumentasi resmi AWS, mengingat topik RTO/RPO cukup sering muncul dalam soal ujian.)_

Terdapat empat strategi disaster recovery pada AWS, diurutkan dari yang paling murah dengan RTO/RPO paling lambat, hingga yang paling mahal dengan RTO/RPO paling cepat:

| Strategi                     | Cara Kerja                                                                                                                                     | RTO/RPO                                  | Biaya             |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------- |
| **Backup & Restore**         | Backup dilakukan secara rutin; pemulihan dilakukan dari awal di region lain saat terjadi bencana                                               | Paling lambat (hitungan jam hingga hari) | Paling murah      |
| **Pilot Light**              | Komponen inti (umumnya database) tetap berjalan dan tersinkronisasi di region DR secara minimal; komponen lain baru diaktifkan saat dibutuhkan | Lebih cepat dari Backup & Restore        | Menengah ke bawah |
| **Warm Standby**             | Versi berskala kecil dari environment produksi selalu berjalan di region DR, tinggal ditingkatkan kapasitasnya saat dibutuhkan                 | Lebih cepat lagi (hitungan menit)        | Menengah          |
| **Multi-Site Active/Active** | Environment produksi berjalan penuh secara bersamaan di dua region atau lebih                                                                  | Paling cepat, mendekati zero downtime    | Paling mahal      |

**RTO (Recovery Time Objective)** menyatakan berapa lama waktu maksimum yang dapat ditoleransi sebelum sistem kembali pulih. **RPO (Recovery Point Objective)** menyatakan berapa banyak data yang dapat ditoleransi hilang, yang menentukan seberapa sering proses backup atau replikasi perlu dilakukan.

Layanan AWS yang umum digunakan dalam skenario disaster recovery antara lain S3 Cross-Region Replication, RDS/Aurora Read Replica lintas region, Route 53 failover routing, AWS Backup, dan Aurora Global Database.

---

## Latihan Soal

Supaya artikel ini tidak terlalu panjang, 65 soal latihan bergaya SAA-C03 beserta pembahasannya saya taruh di postingan terpisah: {% post_link Latihan-Soal-AWS-SAA-C03 %}.

---

## Penutup

Materi ini tidak sempurna dan bukan pengganti pembelajaran mendalam, tapi semoga membantu Anda mengenali pola soal yang sering menjadi jebakan.

Semoga sukses untuk ujian Anda.
