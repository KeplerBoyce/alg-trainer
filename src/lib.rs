use serde::Serialize;


#[derive(Copy, Clone, Debug)]
pub enum Move {
    M,
    Mp,
    Mt,
    U,
    Up,
    Ut,
}

#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug, Serialize)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum Piece {
    TopBack,
    TopLeft,
    TopFront,
    TopRight,
    BottomBack,
    BottomFront,
}

impl Piece {
    fn to_num(&self) -> u32 {
        match self {
            Piece::TopBack => 0,
            Piece::TopLeft => 1,
            Piece::TopFront => 2,
            Piece::TopRight => 3,
            Piece::BottomBack => 4,
            Piece::BottomFront => 5,
        }
    }
}


#[derive(Copy, Clone, PartialEq, Eq, Hash, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct PieceInfo {
    piece: Piece,
    flipped: bool,
}

impl PieceInfo {
    pub fn create(piece: Piece) -> Self {
        Self {
            piece,
            flipped: false,
        }
    }

    fn is_solved(&self, piece: Piece) -> bool {
        self.piece == piece && !self.flipped
    }

    pub fn flipped(&self) -> Self {
        Self {
            piece: self.piece,
            flipped: !self.flipped,
        }
    }
}


#[derive(Clone, PartialEq, Eq, Hash, Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct State {
    pub top_back: PieceInfo,
    pub top_left: PieceInfo,
    pub top_front: PieceInfo,
    pub top_right: PieceInfo,
    pub bottom_back: PieceInfo,
    pub bottom_front: PieceInfo,
    pub m_parity: u32,
    pub u_parity: u32,
}

impl State {
    pub fn default() -> Self {
        Self {
            top_back: PieceInfo::create(Piece::TopBack),
            top_left: PieceInfo::create(Piece::TopLeft),
            top_front: PieceInfo::create(Piece::TopFront),
            top_right: PieceInfo::create(Piece::TopRight),
            bottom_back: PieceInfo::create(Piece::BottomBack),
            bottom_front: PieceInfo::create(Piece::BottomFront),
            m_parity: 0,
            u_parity: 0,
        }
    }

    pub fn create(
        tb: Piece, tl: Piece, tf: Piece, tr: Piece, bb: Piece, bf: Piece,
        tbf: bool, tlf: bool, tff: bool, trf: bool, bbf: bool, bff: bool,
        m_parity: u32, u_parity: u32,
    ) -> Self {
        Self {
            top_back: PieceInfo {
                piece: tb,
                flipped: tbf,
            },
            top_left: PieceInfo {
                piece: tl,
                flipped: tlf,
            },
            top_front: PieceInfo {
                piece: tf,
                flipped: tff,
            },
            top_right: PieceInfo {
                piece: tr,
                flipped: trf,
            },
            bottom_back: PieceInfo {
                piece: bb,
                flipped: bbf,
            },
            bottom_front: PieceInfo {
                piece: bf,
                flipped: bff,
            },
            m_parity: m_parity % 4,
            u_parity: u_parity % 4,
        }
    }

    pub fn create_eo(
        tb: Piece, tl: Piece, tf: Piece, tr: Piece, bb: Piece, bf: Piece,
    ) -> Self {
        Self::create(tb, tl, tf, tr, bb, bf, false, false, false, false, false, false, 0, 0)
    }

    pub fn create_eo_from_num(num: usize) -> Self {
        let mut result = Self::default();
        let mut num = num;
        let mut available = vec![
            Piece::BottomBack,
            Piece::BottomFront,
            Piece::TopLeft,
            Piece::TopRight,
            Piece::TopBack,
            Piece::TopFront,
        ];
        
        result.bottom_back.piece = available.remove(num / 60);
        num %= 60;
        result.bottom_front.piece = available.remove(num / 12);
        num %= 12;
        result.top_left.piece = available.remove(num / 3);
        num %= 3;
        result.top_right.piece = available.remove(num);
        result.top_back.piece = available.remove(0);
        result.top_front.piece = available.remove(0);
        if result.even_parity() {
            return result;
        }
        let temp_piece = result.top_back;
        result.top_back = result.top_front;
        result.top_front = temp_piece;
        return result;
    }

    pub fn is_solved(&self) -> bool {
        self.top_back.is_solved(Piece::TopBack) &&
        self.top_left.is_solved(Piece::TopLeft) &&
        self.top_front.is_solved(Piece::TopFront) &&
        self.top_right.is_solved(Piece::TopRight) &&
        self.bottom_back.is_solved(Piece::BottomBack) &&
        self.bottom_front.is_solved(Piece::BottomFront) &&
        self.m_parity == 0 &&
        self.u_parity == 0
    }

    fn even_parity(&self) -> bool {
        let mut even_parity = true;
        let mut cycle_map = [0; 6];
        cycle_map[0] = self.top_back.piece.to_num();
        cycle_map[1] = self.top_left.piece.to_num();
        cycle_map[2] = self.top_front.piece.to_num();
        cycle_map[3] = self.top_right.piece.to_num();
        cycle_map[4] = self.bottom_back.piece.to_num();
        cycle_map[5] = self.bottom_front.piece.to_num();

        let mut visited = [false; 6];

        for i in 0..6 {
            if visited[i] {
                continue;
            }
            let mut j: usize = cycle_map[i] as usize;
            let mut cycle_len = 1;

            while j != i {
                visited[j] = true;
                j = cycle_map[j] as usize;
                cycle_len += 1;
            }
            if cycle_len % 2 == 0 {
                even_parity = !even_parity;
            }
        }
        even_parity
    }

    pub fn apply(&self, m: Move) -> Self {
        match m {
            Move::M => Self {
                top_back: self.bottom_back.flipped(),
                top_left: self.top_left,
                top_front: self.top_back.flipped(),
                top_right: self.top_right,
                bottom_back: self.bottom_front.flipped(),
                bottom_front: self.top_front.flipped(),
                m_parity: (self.m_parity + 1) % 4,
                u_parity: self.u_parity,
            },
            Move::Mp => Self {
                top_back: self.top_front.flipped(),
                top_left: self.top_left,
                top_front: self.bottom_front.flipped(),
                top_right: self.top_right,
                bottom_back: self.top_back.flipped(),
                bottom_front: self.bottom_back.flipped(),
                m_parity: (self.m_parity + 3) % 4,
                u_parity: self.u_parity,
            },
            Move::Mt => Self {
                top_back: self.bottom_front,
                top_left: self.top_left,
                top_front: self.bottom_back,
                top_right: self.top_right,
                bottom_back: self.top_front,
                bottom_front: self.top_back,
                m_parity: (self.m_parity + 2) % 4,
                u_parity: self.u_parity,
            },
            Move::U => Self {
                top_back: self.top_left,
                top_left: self.top_front,
                top_front: self.top_right,
                top_right: self.top_back,
                bottom_back: self.bottom_back,
                bottom_front: self.bottom_front,
                m_parity: self.m_parity,
                u_parity: (self.u_parity + 1) % 4,
            },
            Move::Up => Self {
                top_back: self.top_right,
                top_left: self.top_back,
                top_front: self.top_left,
                top_right: self.top_front,
                bottom_back: self.bottom_back,
                bottom_front: self.bottom_front,
                m_parity: self.m_parity,
                u_parity: (self.u_parity + 3) % 4,
            },
            Move::Ut => Self {
                top_back: self.top_front,
                top_left: self.top_right,
                top_front: self.top_back,
                top_right: self.top_left,
                bottom_back: self.bottom_back,
                bottom_front: self.bottom_front,
                m_parity: self.m_parity,
                u_parity: (self.u_parity + 2) % 4,
            },
        }
    }

    pub fn apply_all(&self, moves: &Vec<Move>) -> Self {
        let mut result = self.clone();

        for m in moves {
            result = result.apply(*m);
        }
        result
    }
}


pub trait WithPush<T> {
    fn with_push(&self, item: T) -> Self;
}

impl WithPush<Move> for Vec<Move> {
    fn with_push(&self, item: Move) -> Self {
        let mut result = self.clone();
        result.push(item);
        result
    }
}


#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Algorithm {
    pub state: State,
    pub solution: String,
}
